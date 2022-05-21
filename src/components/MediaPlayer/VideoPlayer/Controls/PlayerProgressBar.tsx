import { FC, useContext } from "react";

// components
import { Slider } from "@mui/material";

// context
import { VideoPlayerContext } from "../VideoPlayerContext";

export interface PlayerProgressBarProps {
  onChange: (value: number) => void;
}

const PlayerProgressBar: FC<PlayerProgressBarProps> = ({ onChange }) => {
  const { state } = useContext(VideoPlayerContext);

  return (
    <Slider
      className="hide-thumb"
      value={state.currentTime}
      min={0}
      max={state.duration}
      sx={{ paddingBottom: 1 }}
      onChange={(_, value) => onChange(value as number)}
    />
  );
};

export default PlayerProgressBar;
