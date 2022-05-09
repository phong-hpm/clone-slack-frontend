import { useContext } from "react";

// context
import { MessageSocketContext } from "pages/ChatPage/Context/MessageSocketContext";
import { SocketEvent } from "utils/constants";

// components
import { Delta } from "quill";

const useMessageSocket = () => {
  // if socket is connected, socket will not null
  const { socket } = useContext(MessageSocketContext);

  const emitAddMessage = (delta: Delta) => {
    socket?.emit(SocketEvent.EMIT_ADD_MESSAGE, { data: { delta } });
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
