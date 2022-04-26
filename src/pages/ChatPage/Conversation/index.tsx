import { FC } from "react";

// components
import { Box } from "@mui/system";
import ChatBox from "./ChatBox";
import ConversationHeader from "./ConversationHeader";
import ConversationToolBar from "./ConversationToolBar";

const Conversation: FC = () => {
  return (
    <Box flex="1" display="flex" flexDirection="column" bgcolor="#1A1D21">
      <ConversationHeader />
      <ConversationToolBar />
      <ChatBox />
    </Box>
  );
};

export default Conversation;
