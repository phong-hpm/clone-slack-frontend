import { useCallback, useEffect, useRef } from "react";
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
  pushMoreMessagesList,
} from "store/slices/messages.slice";
import { setMessageSocket } from "store/slices/socket.slice";
import { setSelectedChannelId } from "store/slices/channels.slice";

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

export const MessageSocketListener = () => {
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
      // add cached [messages]
      cacheUtils.addCachedMessage({ channelId, message });
      cacheUtils.setChannelUpdatedTime(channelId, { message: updatedTime });

      dispatch(addMessage(message));
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

  const handleEditMessage: UploadMessageListener = useCallback(
    ({ channelId, message, updatedTime }) => {
      // update cached [messages]
      cacheUtils.setChannelUpdatedTime(channelId, { message: updatedTime });
      cacheUtils.updateCachedMessage({ channelId, message });

      dispatch(updateMessage(message));
    },
    [dispatch]
  );

  const handleRemoveMessage: RemoveMessageListener = useCallback(
    ({ channelId, messageId, updatedTime }) => {
      // update cached [messages]
      cacheUtils.setChannelUpdatedTime(channelId, { message: updatedTime });
      cacheUtils.removeCachedMessage({ channelId, messageId });

      dispatch(removeMessage(messageId));
    },
    [dispatch]
  );

  const handleSetMessageList: LoadMessagesListener = useCallback(
    ({ channelId, messages, updatedTime, hasMore }) => {
      // cache [messages] of this [channelId]
      cacheUtils.setChannelUpdatedTime(channelId, { message: updatedTime });
      cacheUtils.setCachedMessages({ channelId, messages, hasMore });

      dispatch(setMessagesList({ hasMore, messages }));
    },
    [dispatch]
  );

  const handleMoreMessages: LoadMessagesListener = useCallback(
    ({ channelId, messages, hasMore, updatedTime }) => {
      dispatch(pushMoreMessagesList({ hasMore, messages }));
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
      const { messages, hasMore } = cacheUtils.getCachedMessages(selectedChannelId);
      // because we didn't store [loadMOreMessages] in [localstorage]
      //   when [messages] were loaded from [localstorage], hasMore have to be true
      dispatch(setMessagesList({ messages, hasMore }));
    }
  }, [unreadMessageCount, selectedChannelId, dispatch]);

  // setup socket
  useEffect(() => {
    if (!socket) return;
    dispatch(setMessageSocket(socket));

    socket
      .on(SocketEventDefault.CONNECT, () => {
        const { selectedChannelId, unreadMessageCount } = keepRef.current;
        const isSameUpdatedTime = cacheUtils.isSameUpdatedTime(selectedChannelId);
        if (unreadMessageCount || !isSameUpdatedTime) {
          socket.emit(SocketEvent.EMIT_LOAD_MESSAGES, { data: { limit: 20 } });
        }
      })
      .on(SocketEventDefault.DISCONNECT, () => {});

    socket
      .on(SocketEvent.ON_MESSAGES, handleSetMessageList)
      .on(SocketEvent.ON_MORE_MESSAGES, handleMoreMessages)
      .on(SocketEvent.ON_ADDED_MESSAGE, handleAddNewMessage)
      .on(SocketEvent.ON_SHARE_MESSAGE_TO_CHANNEL, handleShareMessageToChannel)
      .on(SocketEvent.ON_EDITED_MESSAGE, handleEditMessage)
      .on(SocketEvent.ON_REMOVED_MESSAGE, handleRemoveMessage)
      .on(SocketEvent.ON_REMOVED_MESSAGE_FILE, handleEditMessage);

    !socket.connected && socket.connect();
    return () => {
      socket.disconnect();
    };
  }, [
    socket,
    handleSetMessageList,
    handleAddNewMessage,
    handleMoreMessages,
    handleShareMessageToChannel,
    handleEditMessage,
    handleRemoveMessage,
    dispatch,
  ]);

  return <></>;
};

export default MessageSocketListener;
