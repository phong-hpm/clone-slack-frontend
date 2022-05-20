import { FC, useContext, useState } from "react";

// components
import { Box, Tooltip, Slider } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import IconButtonCustom from "./IconButtonCustom";

// context
import { VideoPlayerContext } from "../VideoPlayerContext";

export interface PlayerVolumeProps {
  onChange: (value: number) => void;
}

const PlayerVolume: FC<PlayerVolumeProps> = ({ onChange }) => {
  const { state } = useContext(VideoPlayerContext);

  const [isHoverVolume, setHoverVolume] = useState(false);

  return (
    <Box
      display="flex"
      alignItems="center"
      pr={2}
      onMouseOver={() => setHoverVolume(true)}
      onMouseLeave={() => setHoverVolume(false)}
    >
      <Tooltip title="Mute">
        <IconButtonCustom onClick={() => onChange(state.volume ? 0 : 10)}>
          <SlackIcon icon={state.volume ? "volume-up" : "volume-off-alt"} />
        </IconButtonCustom>
      </Tooltip>

      {isHoverVolume && (
        <Slider
          className="hide-thumb"
          value={state.volume}
          min={0}
          max={10}
          sx={{ width: 70, ml: 1, py: 1 }}
          onChange={(_, value) => onChange(value as number)}
        />
      )}
    </Box>
  );
};

export default PlayerVolume;
