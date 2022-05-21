import { FC, useContext } from "react";

// components
import { Box, Typography } from "@mui/material";

// context
import { VideoPlayerContext } from "../VideoPlayerContext";

// utils
import { buildProgressTime } from "utils/waveSurver";

export interface PlayerDurationProps {}

const PlayerDuration: FC<PlayerDurationProps> = () => {
  const { state } = useContext(VideoPlayerContext);

  return (
    <Box my={1}>
      <Typography fontWeight={700}>
        {buildProgressTime(state.currentTime)} / {buildProgressTime(state.duration)}
      </Typography>
    </Box>
  );
};

export default PlayerDuration;
