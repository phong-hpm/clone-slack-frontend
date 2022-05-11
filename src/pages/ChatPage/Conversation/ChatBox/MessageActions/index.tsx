import { FC, useRef, useState } from "react";

// components
import { Box } from "@mui/system";
import { IconButton, Tooltip } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import EmojiIcon from "components/EmojiIcon";
import MoreMenu, { MoreMenuProps } from "./MoreMenu";
import EmojiModal from "pages/ChatPage/Conversation/ChatBox/EmojiModal";

// utils
import { color, css } from "utils/constants";

// hooks
import useMessageSocket from "pages/ChatPage/hooks/useMessageSocket";

export interface MessageActionsProps extends Omit<MoreMenuProps, "open" | "anchorEl"> {
  isStared?: boolean;
  onClickShare: () => void;
}

const MessageActions: FC<MessageActionsProps> = ({
  isSystem,
  isStared,
  messageId,
  onClickShare,
  onClose,
  ...props
}) => {
  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const moreReactionButtonRef = useRef<HTMLButtonElement>(null);

  const { emitStarMessage, emitReactionMessage } = useMessageSocket();

  const [isShowMoreMenu, setShowMoreMenu] = useState(false);
  const [isShowEmojiModal, setShowEmojiModal] = useState(false);

  const handleStarMessage = () => {
    messageId && emitStarMessage(messageId);
  };

  const handleReactionMessage = (emojiId: string) => {
    messageId && emitReactionMessage(messageId, emojiId);
  };

  const handleClose = () => {
    setShowMoreMenu(false);
    onClose();
  };

  return (
    <Box
      color={color.HIGH}
      bgcolor={color.PRIMARY_BACKGROUND}
      boxShadow={css.BOX_SHADOW}
      p={0.25}
      borderRadius={1}
    >
      <Tooltip title="Completed">
        <IconButton
          sx={{ borderRadius: 0.5 }}
          onClick={() => handleReactionMessage("white_check_mark")}
        >
          <EmojiIcon id="white_check_mark" fontSize="large" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Take a look...">
        <IconButton sx={{ borderRadius: 0.5 }} onClick={() => handleReactionMessage("eyes")}>
          <EmojiIcon id="eyes" fontSize="large" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Nicely done" onClick={() => handleReactionMessage("raised_hands")}>
        <IconButton sx={{ borderRadius: 0.5 }}>
          <EmojiIcon id="raised_hands" fontSize="large" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Find another reaction">
        <IconButton
          ref={moreReactionButtonRef}
          sx={{ borderRadius: 0.5 }}
          onClick={() => setShowEmojiModal(true)}
        >
          <SlackIcon icon="add-reaction" fontSize="large" />
        </IconButton>
      </Tooltip>
      {!isSystem && (
        <Tooltip title="Realy in thread">
          <IconButton sx={{ borderRadius: 0.5 }}>
            <SlackIcon icon="comment-alt" fontSize="large" />
          </IconButton>
        </Tooltip>
      )}
      <Tooltip title="Share message">
        <IconButton sx={{ borderRadius: 0.5 }} onClick={onClickShare}>
          <SlackIcon icon="forward" fontSize="large" />
        </IconButton>
      </Tooltip>
      <Tooltip title="Add to saved item">
        <IconButton sx={{ borderRadius: 0.5 }} onClick={handleStarMessage}>
          {isStared ? (
            <SlackIcon color={color.DANGER} icon="bookmark-filled" fontSize="large" />
          ) : (
            <SlackIcon icon="bookmark" fontSize="large" />
          )}
        </IconButton>
      </Tooltip>
      <Tooltip title="More actions">
        <IconButton
          ref={moreButtonRef}
          sx={{ borderRadius: 0.5 }}
          onClick={() => setShowMoreMenu(true)}
        >
          <SlackIcon icon="ellipsis-vertical-filled" fontSize="large" />
        </IconButton>
      </Tooltip>

      <MoreMenu
        open={isShowMoreMenu}
        messageId={messageId}
        isSystem={isSystem}
        anchorEl={moreButtonRef.current}
        onClose={handleClose}
        {...props}
      />

      <EmojiModal
        isOpen={isShowEmojiModal}
        anchorEl={moreReactionButtonRef.current}
        onEmojiSelect={(emoji) => handleReactionMessage(emoji.id)}
        onClose={() => setShowEmojiModal(false)}
      />
    </Box>
  );
};

export default MessageActions;
