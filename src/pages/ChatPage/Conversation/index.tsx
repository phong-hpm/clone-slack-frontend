import { FC, memo } from "react";

// context
import MessageSocketProvider from "pages/ChatPage/Context/MessageSocketContext";

// components
import { Box, Link, Typography } from "@mui/material";
import ChatBox from "./ChatBox";
import ConversationHeader from "./ConversationHeader";
import ConversationToolBar from "./ConversationToolBar";
import MessageInput from "./ChatBox/MessageInput";

// utils
import { color } from "utils/constants";

const Conversation: FC = () => {
  return (
    <Box flex="1" display="flex" flexDirection="column" bgcolor={color.PRIMARY_BACKGROUND}>
      <ConversationHeader />
      <ConversationToolBar />
      <MessageSocketProvider>
        <ChatBox />
        <Box px={2.5}>
          <MessageInput />
        </Box>
      </MessageSocketProvider>
      <Box display="flex" justifyContent="end" pr={3} py={0.5}>
        <Link component="button" underline="hover" color={color.HIGHLIGHT}>
          <Typography variant="h6" fontSize={10.5}>
            <strong>Shift + Return</strong> to add a new line
          </Typography>
        </Link>
      </Box>
    </Box>
  );
};

export default memo(Conversation);
