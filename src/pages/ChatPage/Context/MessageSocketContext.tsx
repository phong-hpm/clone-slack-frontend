import { createContext, FC, useCallback, useEffect, useMemo, useState } from "react";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import * as channelsSelector from "store/selectors/channels.selector";

// redux slices
import {
  setLoading,
  addMessage,
  updateMessage,
  removeMessage,
  setMessagesList,
} from "store/slices/messages.slice";

// hooks
import useSocket from "hooks/useSocket";

// utils
import { SocketEvent, SocketEventDefault } from "utils/constants";
import { useParams } from "react-router-dom";

// types
import { MessageType } from "store/slices/_types";
import { MessageContextType } from "./_types";

const initialContext: MessageContextType = {
  isConnected: false,
  updateNamespace: () => {},
};

export const MessageSocketContext = createContext<MessageContextType>(initialContext);

export interface MessageSocketProviderProps {
  children: React.ReactNode;
}

export const MessageSocketProvider: FC<MessageSocketProviderProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { teamId } = useParams();

  const selectedChannelId = useSelector(channelsSelector.getSelectedChannelId);

  const { socket, updateNamespace } = useSocket();

  const [isConnected, setConnected] = useState(false);

  const handleAddNewMessage = useCallback(
    (message: MessageType) => dispatch(addMessage(message)),
    [dispatch]
  );

  const handleUpdateMessage = useCallback(
    (message: MessageType) => dispatch(updateMessage(message)),
    [dispatch]
  );

  const handleRemoveMessage = useCallback((id: string) => dispatch(removeMessage(id)), [dispatch]);

  const handleUpdateMessageList = useCallback(
    (messages: MessageType[]) => dispatch(setMessagesList(messages)),
    [dispatch]
  );

  // update namespace when selectedChannel was updated
  useEffect(() => {
    if (!selectedChannelId) return;
    updateNamespace(`/${teamId}/${selectedChannelId}`);
  }, [teamId, selectedChannelId, updateNamespace]);

  useEffect(() => {
    if (!socket) return;

    dispatch(setLoading(true));
    socket
      .on(SocketEventDefault.CONNECT, () => {
        setConnected(true);
        socket.emit(SocketEvent.EMIT_LOAD_MESSAGES, {});
      })
      .on(SocketEventDefault.DISCONNECT, () => {
        setConnected(false);
        dispatch(setLoading(false));
      });

    socket
      .on(SocketEvent.ON_MESSAGES, (message: MessageType[]) => {
        handleUpdateMessageList(message);
        dispatch(setLoading(false));
      })
      .on(SocketEvent.ON_ADDED_MESSAGE, handleAddNewMessage)
      .on(SocketEvent.ON_EDITED_MESSAGE, handleUpdateMessage)
      .on(SocketEvent.ON_REMOVED_MESSAGE, handleRemoveMessage)
      .on(SocketEvent.ON_REMOVED_MESSAGE_FILE, handleUpdateMessage);

    socket.connect();
    return () => {
      socket?.disconnect();
    };
  }, [
    socket,
    handleUpdateMessageList,
    handleAddNewMessage,
    handleUpdateMessage,
    handleRemoveMessage,
    dispatch,
  ]);

  const value = useMemo(
    () => ({
      socket,
      isConnected,
      updateNamespace,
    }),
    [socket, isConnected, updateNamespace]
  );

  return <MessageSocketContext.Provider value={value}>{children}</MessageSocketContext.Provider>;
};

export default MessageSocketProvider;
