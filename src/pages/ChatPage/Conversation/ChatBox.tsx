import { FC, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// redux store
import { useSelector } from "../../../store";

// redux selectors
import * as channelsSelector from "../../../store/selectors/channels.selector";
import * as authSelectors from "../../../store/selectors/auth.selector";

// redux slices
import { addMessageList, MessageType, setMessagesList } from "../../../store/slices/messages.slice";

// utils
import { SocketEvent, SocketEventDefault } from "../../../utils/constants";

// hooks
import useSocket from "../../../hooks/useSocket";

// components
import { Box } from "@mui/material";
import ChatBoxMessages from "./ChatBoxMessages";
import MessageTextArea from "./MessageTextArea";

const ChatBox: FC = () => {
  const dispatch = useDispatch();
  const { teamId } = useParams();

  const selectedChannelId = useSelector(channelsSelector.getSelectedChannelId);
  const user = useSelector(authSelectors.getUser);

  const { socket, updateNamespace } = useSocket();

  const handleSendMessage = (text: string) => {
    socket?.emit(SocketEvent.EMIT_ADD_MESSAGE, { userId: user.id, data: { text } });
  };

  const addNewMessage = useCallback(
    (message: MessageType) => dispatch(addMessageList(message)),
    [dispatch]
  );

  const updateMessageList = useCallback(
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

    socket
      .on(SocketEventDefault.CONNECT, () => {
        socket.emit(SocketEvent.EMIT_LOAD_MESSAGES, {});
      })
      .on(SocketEventDefault.DISCONNECT, () => {});

    socket
      .on(SocketEvent.ON_MESSAGES, updateMessageList)
      .on(SocketEvent.ON_NEW_MESSAGE, addNewMessage);

    socket.connect();
    return () => {
      socket?.disconnect();
    };
  }, [socket, updateMessageList, addNewMessage, dispatch]);

  return (
    <Box flex="1" minHeight="1px" display="flex" flexDirection="column">
      <ChatBoxMessages />
      <MessageTextArea onSend={handleSendMessage} />
    </Box>
  );
};

export default ChatBox;
