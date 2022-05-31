import { useContext } from "react";

// context
import { MessageSocketContext } from "pages/ChatPage/Context/MessageSocketContext";

// utils
import { SocketEvent } from "utils/constants";

// types
import { Delta } from "quill";

const useMessageSocket = () => {
  // if socket is connected, socket will not null
  const { socket } = useContext(MessageSocketContext);

  const emitAddMessage = (delta: Delta) => {
    socket?.emit(SocketEvent.EMIT_ADD_MESSAGE, { data: { delta } });
  };

  const emitShareMessageToChannel = (
    toChannelId: string,
    delta: Delta,
    sharedMessageId: string
  ) => {
    socket?.emit(SocketEvent.EMIT_SHARE_MESSAGE_TO_CHANNEL, {
      data: { toChannelId, delta, sharedMessageId },
    });
  };

  const emitShareMessageToGroupUsers = (
    toUserIds: string[],
    delta: Delta,
    sharedMessageId: string
  ) => {
    socket?.emit(SocketEvent.EMIT_SHARE_MESSAGE_TO_GROUP_USERS, {
      data: { toUserIds, delta, sharedMessageId },
    });
  };

  const emitEditMessage = (id: string, delta: Delta) => {
    socket?.emit(SocketEvent.EMIT_EDIT_MESSAGE, { data: { id, delta } });
  };

  const emitRemoveMessage = (id: string) => {
    socket?.emit(SocketEvent.EMIT_REMOVE_MESSAGE, { data: { id } });
  };

  const emitRemoveMessageFile = (id: string, fileId: string) => {
    socket?.emit(SocketEvent.EMIT_REMOVE_MESSAGE_FILE, { data: { id, fileId } });
  };

  const emitStarMessage = (id: string) => {
    socket?.emit(SocketEvent.EMIT_STAR_MESSAGE, { data: { id } });
  };

  const emitReactionMessage = (id: string, reactionId: string) => {
    socket?.emit(SocketEvent.EMIT_REACTION_MESSAGE, { data: { id, reactionId } });
  };

  return {
    socket,
    emitAddMessage,
    emitShareMessageToChannel,
    emitShareMessageToGroupUsers,
    emitEditMessage,
    emitRemoveMessage,
    emitRemoveMessageFile,
    emitStarMessage,
    emitReactionMessage,
  };
};

export default useMessageSocket;
