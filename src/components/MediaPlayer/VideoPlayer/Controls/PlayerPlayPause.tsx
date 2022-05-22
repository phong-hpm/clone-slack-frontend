import { FC, useContext } from "react";

// components
import { Box, Button, Tooltip, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import IconButtonCustom from "./IconButtonCustom";

// context
import { VideoPlayerContext } from "../VideoPlayerContext";

// utils
import { buildProgressTime } from "utils/waveSurver";

// constants
import { bgButton } from "../_constants";

export interface PlayerPlayPauseProps {
  onClick: () => void;
  isHover?: boolean;
}

const PlayerPlayPause: FC<PlayerPlayPauseProps> = ({ isHover, onClick }) => {
  const { state } = useContext(VideoPlayerContext);

  return state.isFullScreen ? (
    <Tooltip title="Play">
      <IconButtonCustom onClick={onClick}>
        <SlackIcon icon={state.isPlaying ? "pause" : "play"} />
      </IconButtonCustom>
    </Tooltip>
  ) : (
    <Button
      sx={{
        p: 0.625,
        background: isHover ? "transparent" : bgButton,
        "&:hover": { background: bgButton },
      }}
      onClick={onClick}
    >
      <SlackIcon icon={state.isPlaying ? "pause" : "play-filled"} />
      <Box ml={1} mr={0.5}>
        <Typography fontWeight={700}>{buildProgressTime(state.currentTime)}</Typography>
      </Box>
    </Button>
  );
};

export default PlayerPlayPause;
