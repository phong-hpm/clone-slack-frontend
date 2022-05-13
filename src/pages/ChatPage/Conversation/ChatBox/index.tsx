import { FC, useRef } from "react";

// redux store
import { useSelector } from "store";

// redux selectors
import * as channelsSelector from "store/selectors/channels.selector";

// utils
import { color } from "utils/constants";

// hooks
import useMessageSocket from "pages/ChatPage/hooks/useMessageSocket";

// components
import { Box, Link, Typography } from "@mui/material";
import MessageContentList from "./MessageContentList";
import MessageInput from "./MessageInput";
import MentionDetailPopover from "./MessageMention/MentionDetailPopover";
import MentionDetailModal from "./MessageMention/MentionDetailModal";
import LinkDetailModal from "./MessageLink/LinkDetailModal";
import LinkDetailPopover from "./MessageLink/LinkDetailPopover";
import LinkEditModal from "./MessageLink/LinkEditModal";

const ChatBox: FC = () => {
  const selectedChannel = useSelector(channelsSelector.getSelectedChannel);

  const { emitAddMessage } = useMessageSocket();

  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <Box
      ref={containerRef}
      className="container"
      flex="1"
      minHeight="1px"
      display="flex"
      flexDirection="column"
    >
      <MessageContentList />

      <Box px={2.5}>
        <MessageInput
          placeHolder={`Send a message to #${selectedChannel?.name || ""}`}
          onSend={emitAddMessage}
        />
      </Box>

      <Box display="flex" justifyContent="end" pr={3} py={0.5}>
        <Link component="button" underline="hover" color={color.HIGHLIGHT}>
          <Typography variant="h6" fontSize={10.5}>
            <strong>Shift + Return</strong> to add a new line
          </Typography>
        </Link>
      </Box>

      <MentionDetailPopover />
      <MentionDetailModal />

      <LinkDetailPopover />
      <LinkDetailModal />
      <LinkEditModal />
    </Box>
  );
};

export default ChatBox;
