import { FC, useCallback, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

// redux store
import { useSelector } from "../../store";

// redux selectors
import * as chanelsSelector from "../../store/selectors/chanels.selector";
import * as authSelectors from "../../store/selectors/auth.selector";
import * as messagesSelectors from "../../store/selectors/messages.selector";
import * as usersSelectors from "../../store/selectors/users.selector";

// redux slices
import { addMessageList, MessageType, setMessagesList } from "../../store/slices/messages.slice";

// utils
import { SocketEvent, SocketEventDefault } from "../../utils/constants";

// hooks
import useSocket from "../../hooks/useSocket";

const Messages: FC = () => {
  const dispatch = useDispatch();
  const { teamId } = useParams();

  const selectedChanelId = useSelector(chanelsSelector.getSelectedChanelId);
  const user = useSelector(authSelectors.getUser);
  const messageList = useSelector(messagesSelectors.getMessageList);
  const userList = useSelector(usersSelectors.getUserList);

  const { socket, updateNamespace } = useSocket();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    socket?.emit(SocketEvent.EMIT_ADD_MESSAGE, {
      userId: user.id,
      data: { text: textareaRef.current?.value },
    });

    // clear textarea value after message added
    textareaRef.current!.value = "";
  };

  const addNewMessage = useCallback(
    (message: MessageType) => dispatch(addMessageList(message)),
    [dispatch]
  );

  const updateMessageList = useCallback(
    (messages: MessageType[]) => dispatch(setMessagesList(messages)),
    [dispatch]
  );

  // update namespace when selectedChanel was updated
  useEffect(() => {
    if (!selectedChanelId) return;
    updateNamespace(`/${teamId}/${selectedChanelId}`);
  }, [teamId, selectedChanelId, updateNamespace]);

  useEffect(() => {
    if (!socket) return;

    console.log("socket", socket);

    socket
      .on(SocketEventDefault.CONNECT, () => {
        console.log("connected");
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
    if (!userList.length || !messageList.length) return null;

    return messageList.map((mes) => {
      const userOwner = userList.find((user) => mes.user === user.id);
      return (
        <div key={mes.id} style={{ padding: "5px" }}>
          <div style={{ fontWeight: "bold" }}>{userOwner!.name}</div>
          <div>{mes.text}</div>
        </div>
      );
    });
  };

  return (
    <div
      style={{
        background: "#1A1D21",
        height: "100%",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div style={{ flex: "1 0 auto" }}>{renderMessages()}</div>
      <div style={{ flex: "0 0 auto" }}>
        <textarea ref={textareaRef} />
        <button onClick={handleSendMessage}>send</button>
      </div>
    </div>
  );
};

export default Messages;
