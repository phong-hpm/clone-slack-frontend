import { FC, useContext } from "react";

// components
import { Button, Select, MenuItem, Typography } from "@mui/material";

// context
import { VideoPlayerContext } from "../VideoPlayerContext";

// constants
import { bgButton } from "../_constants";

export interface PlayerSpeedProps {
  onChange: (value: string) => void;
}

const PlayerSpeed: FC<PlayerSpeedProps> = ({ onChange }) => {
  const { state } = useContext(VideoPlayerContext);

  return (
    <Button
      variant="text"
      size={state.isFullScreen ? "large" : "medium"}
      sx={{
        ml: state.isFullScreen ? 2 : 0.5,
        borderRadius: 1,
        px: 0,
        py: state.isFullScreen ? 0.375 : 0,
        ":hover": { background: bgButton },
      }}
      onClick={() => {}}
    >
      <Select
        MenuProps={{
          anchorOrigin: { horizontal: "center", vertical: "top" },
          transformOrigin: { horizontal: "center", vertical: "bottom" },
        }}
        variant="standard"
        value={state.speed}
        onChange={(e) => onChange(e.target.value)}
      >
        <MenuItem disabled>
          <Typography>Playback Speed</Typography>
        </MenuItem>
        <MenuItem value="0.25">0.25x</MenuItem>
        <MenuItem value="0.5">0.5x</MenuItem>
        <MenuItem value="0.75">0.75x</MenuItem>
        <MenuItem value="1">1x</MenuItem>
        <MenuItem value="1.25">1.25x</MenuItem>
        <MenuItem value="1.5">1.5x</MenuItem>
        <MenuItem value="2">2x</MenuItem>
      </Select>
    </Button>
  );
};

export default PlayerSpeed;
