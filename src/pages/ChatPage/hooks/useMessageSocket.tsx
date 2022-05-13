import { useContext } from "react";

// context
import { MessageSocketContext } from "pages/ChatPage/Context/MessageSocketContext";

// utils
import { SocketEvent } from "utils/constants";

// types
import { Delta } from "quill";
import { MessageFileType } from "store/slices/_types";

const useMessageSocket = () => {
  // if socket is connected, socket will not null
  const { socket } = useContext(MessageSocketContext);

  const emitAddMessage = (delta: Delta, files: MessageFileType[]) => {
    socket?.emit(SocketEvent.EMIT_ADD_MESSAGE, { data: { delta, files } });
  };

  const emitEditMessage = (id: string, delta: Delta) => {
    socket?.emit(SocketEvent.EMIT_EDIT_MESSAGE, { data: { id, delta } });
  };

  const emitRemoveMessage = (id: string) => {
    socket?.emit(SocketEvent.EMIT_REMOVE_MESSAGE, { data: { id } });
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
    emitEditMessage,
    emitRemoveMessage,
    emitStarMessage,
    emitReactionMessage,
  };
};

export default useMessageSocket;
