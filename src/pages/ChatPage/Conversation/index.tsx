import { FC } from "react";

// context
import MessageSocketProvider from "pages/ChatPage/Context/MessageSocketContext";

// components
import { Box } from "@mui/material";
import ChatBox from "./ChatBox";
import ConversationHeader from "./ConversationHeader";
import ConversationToolBar from "./ConversationToolBar";

// utils
import { color } from "utils/constants";

const Conversation: FC = () => {
  return (
    <Box flex="1" display="flex" flexDirection="column" bgcolor={color.PRIMARY_BACKGROUND}>
      <MessageSocketProvider>
        <ConversationHeader />
        <ConversationToolBar />
        <ChatBox />
      </MessageSocketProvider>
    </Box>
  );
};

export default Conversation;
