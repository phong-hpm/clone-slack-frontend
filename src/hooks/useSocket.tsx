import { useCallback, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

// redux store
import { useSelector } from "../store";

// redux selector
import * as authSelectors from "../store/selectors/auth.selector";

// utils
import { SocketEvent, SocketEventDefault } from "../utils/constants";

export interface UseSocketProps {
  namespace?: string;
}

const useSocket = () => {
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

    console.log("namespace", `-${namespace}-`, `ws://localhost:8000/${namespace}`);

    // setup socket
    socketRef.current = io(`ws://localhost:8000/${namespace}`, {
      autoConnect: false,
      auth: { email: user.email, name: user.name, accessToken },
    });

    // authenticated listener
    socketRef.current.on(SocketEvent.ON_AUTHENTICATED, ({ authenticated }) => {
      console.log("authenticated", authenticated);
    });

    // authentication failed listener
    socketRef.current.on(SocketEvent.ON_ATOKEN_EXPIRED, () => {
      console.log("token is expired");
    });

    // connection's errors listener
    socketRef.current.on(SocketEventDefault.CONNECT_ERROR, (error) => {
      console.log(error.name, error.message);
    });

    setSocket(socketRef.current);
  }, [isAuth, namespace, accessToken, user]);

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
