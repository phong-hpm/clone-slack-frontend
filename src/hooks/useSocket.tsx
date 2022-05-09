import { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

// redux store
import { useDispatch, useSelector } from "store";
import { renewAccessToken } from "store/actions/auth/renewToken";

// redux selector
import * as authSelectors from "store/selectors/auth.selector";
import { setIsAuth } from "store/slices/auth.slice";

// utils
import { SocketEvent, SocketEventDefault } from "utils/constants";

const useSocket = () => {
  const dispatch = useDispatch();

  const isAuth = useSelector(authSelectors.isAuth);
  const user = useSelector(authSelectors.getUser);
  const accessToken = useSelector(authSelectors.getAccessToken);

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
    socketRef.current = io(`ws://localhost:8000/${namespace}`, {
      autoConnect: false,
      auth: { userId: user.id, email: user.email, name: user.name, accessToken },
    });

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
    socketRef.current.on(SocketEventDefault.CONNECT_ERROR, (error) => {});

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
