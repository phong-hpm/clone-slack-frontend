import { FC, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// redux store
import { useSelector } from "../../../store";

// redux selectors
import * as channelsSelector from "../../../store/selectors/channels.selector";
import * as authSelectors from "../../../store/selectors/auth.selector";
import * as messagesSelectors from "../../../store/selectors/messages.selector";
import * as usersSelectors from "../../../store/selectors/users.selector";

// redux slices
import { addMessageList, MessageType, setMessagesList } from "../../../store/slices/messages.slice";

// utils
import { SocketEvent, SocketEventDefault } from "../../../utils/constants";

// hooks
import useSocket from "../../../hooks/useSocket";

// components
import { Box } from "@mui/material";
import MessageTextArea from "./MessageTextArea";

const Messages: FC = () => {
  const dispatch = useDispatch();
  const { teamId } = useParams();

  const selectedChannelId = useSelector(channelsSelector.getSelectedChannelId);
  const user = useSelector(authSelectors.getUser);
  const messageList = useSelector(messagesSelectors.getMessageList);
  const userList = useSelector(usersSelectors.getUserList);

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
      .on(SocketEventDefault.DISCONNECT, () => {
        console.log("disconnected");
      });

    socket
      .on(SocketEvent.ON_MESSAGES, updateMessageList)
      .on(SocketEvent.ON_NEW_MESSAGE, addNewMessage);

    socket.connect();
    return () => {
      socket?.disconnect();
    };
  }, [socket, updateMessageList, addNewMessage, dispatch]);

  const renderMessages = () => {
    if (!userList.length || !messageList.length) return <></>;

    return messageList.map((message) => {
      const userOwner = userList.find((user) => message.user === user.id);
      return (
        <div key={message.id} className="message-item">
          <div className="message-user">{userOwner!.name}</div>
          <div className="message-text">{message.text}</div>
        </div>
      );
    });
  };

  return (
    <Box display="flex" flexDirection="column" className="messages">
      <Box flex="1 1 auto" className="messages-list">
        {renderMessages()}
      </Box>
      <Box flex="0 0 auto">
        <MessageTextArea onSend={handleSendMessage} />
      </Box>
    </Box>
  );
};

export default Messages;
