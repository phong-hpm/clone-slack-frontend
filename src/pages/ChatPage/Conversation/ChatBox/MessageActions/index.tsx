import { FC, useRef, useState } from "react";

// components
import { Box, IconButton, Tooltip } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import EmojiIcon from "components/Emoji/EmojiIcon";
import MoreMenu, { MoreMenuProps } from "./MoreMenu";
import EmojiModal from "features/EmojiModal";

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

  const actions = [
    {
      tooltip: "Completed",
      emojiIcon: "white_check_mark",
      onClick: () => handleReactionMessage("white_check_mark"),
    },
    {
      tooltip: "Take a look...",
      emojiIcon: "eyes",
      onClick: () => handleReactionMessage("eyes"),
    },
    {
      tooltip: "Nicely done",
      emojiIcon: "raised_hands",
      onClick: () => handleReactionMessage("raised_hands"),
    },
    {
      tooltip: "Find another reaction",
      slackIcon: "add-reaction",
      onClick: () => setShowEmojiModal(true),
    },
    {
      isHide: isSystem,
      tooltip: "Realy in thread",
      slackIcon: "comment-alt",
      onClick: () => {},
    },
    {
      tooltip: "Share message",
      slackIcon: "forward",
      onClick: onClickShare,
    },
    {
      tooltip: "Add to saved item",
      slackIcon: isStared ? "bookmark-filled" : "bookmark",
      iconColor: isStared ? color.DANGER : undefined,
      onClick: handleStarMessage,
    },
    {
      ref: moreButtonRef,
      tooltip: "More actions",
      slackIcon: "ellipsis-vertical-filled",
      onClick: () => setShowMoreMenu(true),
    },
  ];

  const actionDisplay = actions.filter((item) => !item.isHide);

  return (
    <Box
      color={color.HIGH}
      bgcolor={color.PRIMARY_BACKGROUND}
      boxShadow={css.BOX_SHADOW}
      p={0.25}
      borderRadius={1}
    >
      {actionDisplay.map((action) => {
        return (
          <Tooltip key={action.tooltip} title={action.tooltip}>
            <IconButton
              ref={action.ref}
              size="large"
              sx={{ borderRadius: 0.5 }}
              onClick={action.onClick}
            >
              {action.emojiIcon && <EmojiIcon id={action.emojiIcon} fontSize="large" />}
              {action.slackIcon && (
                <SlackIcon color={action.iconColor} icon={action.slackIcon} fontSize="large" />
              )}
            </IconButton>
          </Tooltip>
        );
      })}

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
