import { createContext, FC, useCallback, useEffect, useMemo, useRef } from "react";

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
  setLoading,
} from "store/slices/messages.slice";

// hooks
import useSocket from "hooks/useSocket";

// utils
import cacheUtils from "utils/cacheUtils";
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

  const keepRef = useRef({ unreadMessageCount: 0, selectedChannelId: "" });
  // keep these datas onto keepRef will help using them without add to dependences
  keepRef.current.selectedChannelId = selectedChannelId;
  keepRef.current.unreadMessageCount = unreadMessageCount;

  const handleAddNewMessage = useCallback(
    ({
      channelId,
      message,
      updatedTime,
    }: {
      channelId: string;
      message: MessageType;
      updatedTime: number;
    }) => {
      dispatch(addMessage(message));
      // add cached [messages]
      cacheUtils.addCachedMessage({ channelId, message });
      cacheUtils.setChannelUpdatedTime(channelId, { message: updatedTime });
      window.dispatchEvent(new Event("scroll-message-list"));
    },
    [dispatch]
  );

  const handleUpdateMessage = useCallback(
    ({
      channelId,
      message,
      updatedTime,
    }: {
      channelId: string;
      message: MessageType;
      updatedTime: number;
    }) => {
      dispatch(updateMessage(message));
      // update cached [messages]
      cacheUtils.setChannelUpdatedTime(channelId, { message: updatedTime });
      cacheUtils.updateCachedMessage({ channelId, message });
    },
    [dispatch]
  );

  const handleRemoveMessage = useCallback(
    ({
      channelId,
      messageId,
      updatedTime,
    }: {
      channelId: string;
      messageId: string;
      updatedTime: number;
    }) => {
      dispatch(removeMessage(messageId));
      // update cached [messages]
      cacheUtils.setChannelUpdatedTime(channelId, { message: updatedTime });
      cacheUtils.removeCachedMessage({ channelId, messageId });
    },
    [dispatch]
  );

  const handleSetMessageList = useCallback(
    ({
      channelId,
      messages,
      updatedTime,
    }: {
      channelId: string;
      messages: MessageType[];
      updatedTime: number;
    }) => {
      dispatch(setMessagesList(messages));
      // cache [messages] of this [channelId]
      cacheUtils.setChannelUpdatedTime(channelId, { message: updatedTime });
      cacheUtils.setCachedMessages({ channelId, messages });
    },
    [dispatch]
  );

  // update namespace when [selectedChannelId] was updated
  useEffect(() => {
    // [updateNamespace] will disconnect socket
    if (selectedChannelId) updateNamespace(`/${teamId}/${selectedChannelId}`);
  }, [teamId, selectedChannelId, updateNamespace]);

  // check and load cache
  useEffect(() => {
    if (!selectedChannelId) return;
    const isSameUpdatedTime = cacheUtils.isSameUpdatedTime(selectedChannelId);

    if (!unreadMessageCount && isSameUpdatedTime) {
      // get cached messages data from localStorage
      const { messages } = cacheUtils.getCachedMessages(selectedChannelId);
      dispatch(setMessagesList(messages));
    }
  }, [unreadMessageCount, selectedChannelId, dispatch]);

  // setup socket
  useEffect(() => {
    if (!socket) return;
    socket
      .on(SocketEventDefault.CONNECT, () => {
        const { selectedChannelId, unreadMessageCount } = keepRef.current;
        const isSameUpdatedTime = cacheUtils.isSameUpdatedTime(selectedChannelId);
        if (unreadMessageCount || !isSameUpdatedTime) {
          dispatch(setLoading(true));
          socket.emit(SocketEvent.EMIT_LOAD_MESSAGES, {});
        }
      })
      .on(SocketEventDefault.DISCONNECT, () => {});

    socket
      .on(SocketEvent.ON_MESSAGES, handleSetMessageList)
      .on(SocketEvent.ON_ADDED_MESSAGE, handleAddNewMessage)
      .on(SocketEvent.ON_EDITED_MESSAGE, handleUpdateMessage)
      .on(SocketEvent.ON_REMOVED_MESSAGE, handleRemoveMessage)
      .on(SocketEvent.ON_REMOVED_MESSAGE_FILE, handleUpdateMessage);

    !socket.connected && socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [
    socket,
    handleSetMessageList,
    handleAddNewMessage,
    handleUpdateMessage,
    handleRemoveMessage,
    dispatch,
  ]);

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
