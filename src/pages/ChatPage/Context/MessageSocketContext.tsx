import { createContext, FC, useCallback, useEffect, useMemo } from "react";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import * as channelsSelector from "store/selectors/channels.selector";

// redux slices
import {
  addMessage,
  updateMessage,
  removeMessage,
  setMessagesList,
  resetMessageState,
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
  const unreadMessageCount = useSelector(channelsSelector.getUnreadMessageCount);

  const { socket, updateNamespace } = useSocket();

  const handleAddNewMessage = useCallback(
    (message: MessageType) => dispatch(addMessage(message)),
    [dispatch]
  );

  const handleUpdateMessage = useCallback(
    (message: MessageType) => dispatch(updateMessage(message)),
    [dispatch]
  );

  const handleRemoveMessage = useCallback((id: string) => dispatch(removeMessage(id)), [dispatch]);

  const handleSetMessageList = useCallback(
    (channelId: string, messages: MessageType[]) => {
      dispatch(setMessagesList({ channelId, messages }));
      localStorage.setItem(channelId, JSON.stringify(messages));
    },
    [dispatch]
  );

  // update namespace when selectedChannel was updated
  useEffect(() => {
    if (!selectedChannelId) return;
    updateNamespace(`/${teamId}/${selectedChannelId}`);
  }, [teamId, selectedChannelId, updateNamespace]);

  // [EMIT_LOAD_MESSAGES] will be emited when [channelId] has new message
  //    or messages were not cached
  useEffect(() => {
    if (!socket || !selectedChannelId) return;
    dispatch(resetMessageState());

    const cachedMessages = localStorage.getItem(selectedChannelId);
    if (!unreadMessageCount && cachedMessages) {
      dispatch(
        setMessagesList({ channelId: selectedChannelId, messages: JSON.parse(cachedMessages) })
      );
    } else {
      socket.emit(SocketEvent.EMIT_LOAD_MESSAGES, {});
    }
  }, [unreadMessageCount, selectedChannelId, socket, dispatch]);

  useEffect(() => {
    if (!socket) return;
    socket.on(SocketEventDefault.CONNECT, () => {}).on(SocketEventDefault.DISCONNECT, () => {});

    socket
      .on(SocketEvent.ON_MESSAGES, handleSetMessageList)
      .on(SocketEvent.ON_ADDED_MESSAGE, handleAddNewMessage)
      .on(SocketEvent.ON_EDITED_MESSAGE, handleUpdateMessage)
      .on(SocketEvent.ON_REMOVED_MESSAGE, handleRemoveMessage)
      .on(SocketEvent.ON_REMOVED_MESSAGE_FILE, handleUpdateMessage);

    socket.connect();
    return () => {
      socket?.disconnect();
    };
  }, [socket, handleSetMessageList, handleAddNewMessage, handleUpdateMessage, handleRemoveMessage]);

  const value = useMemo(
    () => ({
      socket,
      updateNamespace,
    }),
    [socket, updateNamespace]
  );

  return <MessageSocketContext.Provider value={value}>{children}</MessageSocketContext.Provider>;
};

export default MessageSocketProvider;
