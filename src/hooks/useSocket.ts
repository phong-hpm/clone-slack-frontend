import { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

// redux store
import { useDispatch, useSelector } from "store";
import { renewAccessToken } from "store/actions/user/renewToken";

// redux slices
import { setIsAuth } from "store/slices/user.slice";

// redux selector
import userSelectors from "store/selectors/user.selector";

// utils
import { SocketEvent, SocketEventDefault } from "utils/constants";

const useSocket = () => {
  const dispatch = useDispatch();

  const isAuth = useSelector(userSelectors.isAuth);
  const user = useSelector(userSelectors.getUser);
  const accessToken = useSelector(userSelectors.getAccessToken);

  const socketRef = useRef<Socket>();

  const [namespace, setNamespace] = useState("");
  const [socket, setSocket] = useState<Socket>();

  const updateNamespace = useCallback(
    (newNamespace: string) => {
      // disconnect socket before update
      socket?.disconnect();
      setNamespace(newNamespace[0] !== "/" ? newNamespace : newNamespace.slice(1));
    },
    [socket]
  );

  useEffect(() => {
    if (!isAuth || !namespace) return;

    // setup socket
    socketRef.current = io(`${process.env.REACT_APP_SOCKET_BASE_URL}/${namespace}`, {
      autoConnect: false,
      auth: { userId: user.id, email: user.email, name: user.name, accessToken },
    });

    // logger
    /* istanbul ignore next */
    if (process.env.NODE_ENV === "development") {
      socketRef.current.onAny((event, ...args) => {
        // console.group(`%c${event}`, "color: #bada55");
        console.groupCollapsed(`%c${event}`, "color: #bada55");
        console.log(...args);
        console.groupEnd();
      });
    }

    // authenticated listener
    socketRef.current.on(SocketEvent.ON_AUTHENTICATED, ({ authenticated }) => {
      dispatch(setIsAuth(authenticated));
    });

    // authentication failed listener
    socketRef.current.on(SocketEvent.ON_ATOKEN_EXPIRED, () => {
      dispatch(setIsAuth(false));
      dispatch(renewAccessToken());
    });

    // connection's errors listener
    socketRef.current.on(SocketEventDefault.CONNECT_ERROR, (error) => {
      console.log("SocketEventDefault.CONNECT_ERROR", error);
    });

    setSocket(socketRef.current);
  }, [isAuth, namespace, accessToken, user, dispatch]);

  // disconnect socket when component us unmounting
  useEffect(() => {
    return () => {
      if (socket?.connected) {
        socket.disconnect();
      }
    };
  }, [socket]);

  return { socket, updateNamespace };
};

export default useSocket;
