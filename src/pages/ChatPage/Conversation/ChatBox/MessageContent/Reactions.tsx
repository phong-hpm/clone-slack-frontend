import { FC, useRef, useState } from "react";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import userSelectors from "store/selectors/user.selector";

// redux actions
import { emitReactionMessage } from "store/actions/socket/messageSocket.action";

// components
import { Box, Chip, Tooltip, Typography } from "@mui/material";
import EmojiIcon from "components/Emoji/EmojiIcon";
import SlackIcon from "components/SlackIcon";
import EmojiModal from "features/EmojiModal";

// types
import { MessageType } from "store/slices/_types";

export interface ReactionsProps {
  messageId: string;
  reactions: MessageType["reactions"];
}

const Reactions: FC<ReactionsProps> = ({ messageId, reactions }) => {
  const dispatch = useDispatch();

  const anchorEmojiModalRef = useRef<HTMLDivElement>(null);

  const user = useSelector(userSelectors.getUser);

  const [isShowEmojiModal, setShowEmojiModal] = useState(false);

  const reactionList = Object.values(reactions || {});
  if (!reactionList.length) return <></>;

  return (
    <Box display="flex">
      <Box flexBasis={36} mr={1} />

      {reactionList.map((reaction) => (
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
            onClick={() =>
              dispatch(emitReactionMessage({ id: messageId, reactionId: reaction.id }))
            }
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
        onEmojiSelect={(emoji) =>
          dispatch(emitReactionMessage({ id: messageId, reactionId: emoji.id }))
        }
        onClose={() => setShowEmojiModal(false)}
      />
    </Box>
  );
};

export default Reactions;
