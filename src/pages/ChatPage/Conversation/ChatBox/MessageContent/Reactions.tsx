import { FC, useRef, useState } from "react";

// redux store
import { useSelector } from "store";

// redux slices
import { MessageType } from "store/slices/messages.slice";

// redux selectors
import * as authSelectors from "store/selectors/auth.selector";

// components
import { Box, Chip, Tooltip, Typography } from "@mui/material";
import EmojiIcon from "components/EmojiIcon";
import SlackIcon from "components/SlackIcon";
import EmojiModal from "../EmojiModal";

// hooks
import useMessageSocket from "../../../hooks/useMessageSocket";

export interface ReactionsProps {
  message: MessageType;
}

const Reactions: FC<ReactionsProps> = ({ message }) => {
  const anchorEmojiModalRef = useRef<HTMLDivElement>(null);

  const { emitReactionMessage } = useMessageSocket();

  const user = useSelector(authSelectors.getUser);

  const [isShowEmojiModal, setShowEmojiModal] = useState(false);

  if (!message.reactions.length) return <></>;

  return (
    <Box display="flex" py={0.5} pl={8} pr={0.5}>
      {message.reactions.map((reaction) => (
        <Box key={reaction.id} mr={0.5}>
          <Chip
            clickable
            size="small"
            color={reaction.users.includes(user.id) ? "primary" : undefined}
            label={
              <Box display="flex">
                <EmojiIcon id={reaction.id} />
                <Typography variant="h6" sx={{ ml: 0.5 }}>
                  {reaction.count}
                </Typography>
              </Box>
            }
            onClick={() => emitReactionMessage(message.id, reaction.id)}
          />
        </Box>
      ))}

      <Tooltip title="Add reaction...">
        <Chip
          ref={anchorEmojiModalRef}
          clickable
          variant="outlined"
          size="small"
          label={<SlackIcon icon="add-reaction" fontSize="medium" />}
          onClick={() => setShowEmojiModal(true)}
        />
      </Tooltip>

      <EmojiModal
        isOpen={isShowEmojiModal}
        anchorEl={anchorEmojiModalRef.current}
        onEmojiSelect={(emoji) => emitReactionMessage(message.id, emoji.id)}
        onClose={() => setShowEmojiModal(false)}
      />
    </Box>
  );
};

export default Reactions;
