import { FC } from "react";

// components
import { Box } from "@mui/material";
import MessageContentList from "./MessageContentList";
import MentionDetailPopover from "./MessageMention/MentionDetailPopover";
import MentionDetailModal from "./MessageMention/MentionDetailModal";
import LinkDetailModal from "./MessageLink/LinkDetailModal";
import LinkDetailPopover from "./MessageLink/LinkDetailPopover";
import LinkEditModal from "./MessageLink/LinkEditModal";

const ChatBox: FC = () => {
  return (
    <Box className="container" flex="1" minHeight="1px" display="flex" flexDirection="column">
      <MessageContentList />

      <MentionDetailPopover />
      <MentionDetailModal />

      <LinkDetailPopover />
      <LinkDetailModal />
      <LinkEditModal />
    </Box>
  );
};

export default ChatBox;
