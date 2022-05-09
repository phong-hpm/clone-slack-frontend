import { useCallback, useContext } from "react";

// redux store
import { useSelector } from "store";

// redux selectors
import * as authSelectors from "store/selectors/auth.selector";

// context
import { ChannelSocketContext } from "pages/ChatPage/Context/ChannelSocketContext";
import { SocketEvent } from "utils/constants";

const useChannelSocket = () => {
  // if socket is connected, socket will not null
  const { socket } = useContext(ChannelSocketContext);

  const user = useSelector(authSelectors.getUser);

  const handleSendChannel = useCallback(
    (channelName: string, desc: string) => {
      socket?.emit(SocketEvent.EMIT_ADD_CHANNEL, { userId: user.id, data: { channelName } });
    },
    [user.id, socket]
  );

  return { socket, handleSendChannel };
};

export default useChannelSocket;
