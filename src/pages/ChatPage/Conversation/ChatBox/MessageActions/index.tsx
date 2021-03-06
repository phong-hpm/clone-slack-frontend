import { FC, useRef, useState } from "react";

// redux store
import { useDispatch } from "store";

// redux actions
import { emitReactionMessage, emitStarredMessage } from "store/actions/socket/messageSocket.action";

// components
import { Box, IconButton, Tooltip } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import EmojiIcon from "components/Emoji/EmojiIcon";
import MoreMenu, { MoreMenuProps } from "./MoreMenu";
import EmojiModal from "features/EmojiModal";

// utils
import { color, css } from "utils/constants";

// hooks

export interface MessageActionsProps extends Omit<MoreMenuProps, "open" | "anchorEl"> {
  isStarred?: boolean;
  onClickShare: () => void;
}

const MessageActions: FC<MessageActionsProps> = ({
  isSystem,
  isStarred,
  messageId,
  onClickShare,
  onClose,
  ...props
}) => {
  const dispatch = useDispatch();

  const moreButtonRef = useRef<HTMLButtonElement>(null);
  const moreReactionButtonRef = useRef<HTMLButtonElement>(null);

  const [isShowMoreMenu, setShowMoreMenu] = useState(false);
  const [isShowEmojiModal, setShowEmojiModal] = useState(false);

  const handleStarMessage = () => {
    messageId && dispatch(emitStarredMessage({ id: messageId }));
  };

  const handleReactionMessage = (emojiId: string) => {
    messageId && dispatch(emitReactionMessage({ id: messageId, reactionId: emojiId }));
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
    },
    {
      tooltip: "Share message",
      slackIcon: "forward",
      onClick: onClickShare,
    },
    {
      tooltip: "Add to saved item",
      slackIcon: isStarred ? "bookmark-filled" : "bookmark",
      iconColor: isStarred ? color.DANGER : undefined,
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

      {isShowMoreMenu && (
        <MoreMenu
          open={isShowMoreMenu}
          messageId={messageId}
          isSystem={isSystem}
          anchorEl={moreButtonRef.current}
          onClose={handleClose}
          {...props}
        />
      )}

      {isShowEmojiModal && (
        <EmojiModal
          isOpen={isShowEmojiModal}
          anchorEl={moreReactionButtonRef.current}
          onEmojiSelect={(emoji) => handleReactionMessage(emoji.id)}
          onClose={() => setShowEmojiModal(false)}
        />
      )}
    </Box>
  );
};

export default MessageActions;
