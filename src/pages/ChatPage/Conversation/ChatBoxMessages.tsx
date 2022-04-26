import { FC } from "react";

// redux store
import { useSelector } from "../../../store";

// redux selectors
import * as messagesSelectors from "../../../store/selectors/messages.selector";
import * as usersSelectors from "../../../store/selectors/users.selector";

// components
import { Box, Typography } from "@mui/material";

const ChatBoxMessages: FC = () => {
  const messageList = useSelector(messagesSelectors.getMessageList);
  const userList = useSelector(usersSelectors.getUserList);

  if (!userList.length || !messageList.length) return <Box flex="1" />;

  return (
    <Box flex="1" style={{ overflowY: "auto" }}>
      {messageList.map((message) => {
        const userOwner = userList.find((user) => message.user === user.id);
        return (
          <Box key={message.id}>
            <Typography p={0.5}>{userOwner?.name || "unknow"}</Typography>
            <Typography p={0.5}>{message.text}</Typography>
          </Box>
        );
      })}
    </Box>
  );
};

export default ChatBoxMessages;
