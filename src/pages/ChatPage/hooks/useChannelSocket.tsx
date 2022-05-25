import { useCallback, useContext } from "react";

// context
import { ChannelSocketContext } from "pages/ChatPage/Context/ChannelSocketContext";
import { SocketEvent } from "utils/constants";

const useChannelSocket = () => {
  // if socket is connected, socket will not null
  const { socket } = useContext(ChannelSocketContext);

  const handleSendChannel = useCallback(
    (channelName: string, desc: string) =>
      socket?.emit(SocketEvent.EMIT_ADD_CHANNEL, { data: { name: channelName, desc } }),
    [socket]
  );

  return { socket, handleSendChannel };
};

export default useChannelSocket;
