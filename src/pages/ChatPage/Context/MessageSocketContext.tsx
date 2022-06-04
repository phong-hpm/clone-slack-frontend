import { createContext, FC, useCallback, useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import channelsSelectors from "store/selectors/channels.selector";

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

// types
import {
  AddNewMessageListener,
  LoadMessagesListener,
  MessageContextType,
  RemoveMessageListener,
  ShareMessageToChannelListener,
  UploadMessageListener,
} from "./_types";
import { setSelectedChannelId } from "store/slices/channels.slice";

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

  const selectedChannelId = useSelector(channelsSelectors.getSelectedChannelId);
  const unreadMessageCount = useSelector(channelsSelectors.getUnreadMessageCount);

  const { socket, updateNamespace } = useSocket();

  const keepRef = useRef({ unreadMessageCount: 0, selectedChannelId: "" });
  // keep these datas onto keepRef will help using them without add to dependences
  keepRef.current.selectedChannelId = selectedChannelId;
  keepRef.current.unreadMessageCount = unreadMessageCount;

  const handleAddNewMessage: AddNewMessageListener = useCallback(
    ({ channelId, message, updatedTime }) => {
      // this event will be listened on [MessageContentList],
      //   and ask {react-window} sroll to bottom after rendered new list
      // so, this event has to be dispatched before dispatch [addMessage]

      dispatch(addMessage(message));
      // add cached [messages]
      cacheUtils.addCachedMessage({ channelId, message });
      cacheUtils.setChannelUpdatedTime(channelId, { message: updatedTime });
    },
    [dispatch]
  );

  const handleShareMessageToChannel: ShareMessageToChannelListener = useCallback(
    ({ toChannelId, message, updatedTime }) => {
      // add cached [messages]
      cacheUtils.setChannelUpdatedTime(toChannelId, { message: updatedTime });
      cacheUtils.addCachedMessage({ channelId: toChannelId, message });

      dispatch(setSelectedChannelId(toChannelId));
    },
    [dispatch]
  );

  const handleUpdateMessage: UploadMessageListener = useCallback(
    ({ channelId, message, updatedTime }) => {
      dispatch(updateMessage(message));
      // update cached [messages]
      cacheUtils.setChannelUpdatedTime(channelId, { message: updatedTime });
      cacheUtils.updateCachedMessage({ channelId, message });
    },
    [dispatch]
  );

  const handleRemoveMessage: RemoveMessageListener = useCallback(
    ({ channelId, messageId, updatedTime }) => {
      dispatch(removeMessage(messageId));
      // update cached [messages]
      cacheUtils.setChannelUpdatedTime(channelId, { message: updatedTime });
      cacheUtils.removeCachedMessage({ channelId, messageId });
    },
    [dispatch]
  );

  const handleSetMessageList: LoadMessagesListener = useCallback(
    ({ channelId, messages, updatedTime }) => {
      dispatch(setLoading(false));
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
      dispatch(setLoading(false));
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
      .on(SocketEvent.ON_SHARE_MESSAGE_TO_CHANNEL, handleShareMessageToChannel)
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
    handleShareMessageToChannel,
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
