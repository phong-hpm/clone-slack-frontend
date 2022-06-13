import { FC, useState } from "react";

// components
import { Box, BoxProps, IconButton } from "@mui/material";
import AudioPlayer, { AudioPlayerProps } from "components/MediaPlayer/AudioPlayer";
import SlackIcon from "components/SlackIcon";

export interface ReviewAudioCardProps extends AudioPlayerProps {
  onRemove?: () => void;
  boxProps?: BoxProps;
}

const ReviewAudioCard: FC<ReviewAudioCardProps> = ({ onRemove, boxProps, ...props }) => {
  const [isHovering, setHovering] = useState(false);

  return (
    <Box
      position="relative"
      onMouseOver={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      {...boxProps}
    >
      <AudioPlayer {...props} />

      {/* remove button */}
      {isHovering && (
        <Box position="absolute" top={-8} right={0}>
          <IconButton color="secondary" size="medium" onClick={onRemove}>
            <SlackIcon fontSize="small" icon="close" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ReviewAudioCard;
