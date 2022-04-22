import { FC, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import io, { Socket } from "socket.io-client";

import { useSelector } from "../../store";

import * as authSelectors from "../../store/selectors/auth.selector";
import * as messagesSelectors from "../../store/selectors/messages.selector";
import * as usersSelectors from "../../store/selectors/users.selector";

import { addMessageList, setMessagesList } from "../../store/slices/messages.slice";

const Messages: FC = () => {
  const dispatch = useDispatch();
  const { teamId, chanelId } = useParams();

  const user = useSelector(authSelectors.getUser);
  const messageList = useSelector(messagesSelectors.getMessageList);
  const userList = useSelector(usersSelectors.getUserList);

  const socketRef = useRef<Socket>();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSendMessage = () => {
    socketRef.current?.emit("add-message", {
      userId: user.id,
      data: {
        text: textareaRef.current?.value,
      },
    });
    textareaRef.current!.value = "";
  };

  useEffect(() => {
    const socket = io(`ws://localhost:8000/${teamId}/${chanelId}`, { autoConnect: false });
    socketRef.current = socket;
    socket.auth = { email: user.email, name: user.name };

    socket.on("connect", () => {
      socket.emit("load-messages", {});
    });

    socket.on("messages-data", (data) => {
      console.log("connected message", data);
      dispatch(setMessagesList(data));
    });

    socket.on("message-data", (data) => {
      dispatch(addMessageList(data));
    });

    if (teamId && chanelId && user.id) socket.connect();

    return () => {
      socketRef.current?.disconnect();
    };
  }, [teamId, chanelId, user, dispatch]);

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
