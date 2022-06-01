import { FC, useContext } from "react";

// components
import { Tooltip } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import IconButtonCustom from "./IconButtonCustom";

// context
import { VideoPlayerContext } from "../VideoPlayerContext";

// constants
import { color, rgba } from "utils/constants";

export interface PlayerExpandProps {}

const PlayerExpand: FC<PlayerExpandProps> = () => {
  const { state, updateState } = useContext(VideoPlayerContext);

  return (
    <Tooltip title="Expand">
      <IconButtonCustom
        sx={{
          background: state.isFullScreen ? "transparent" : rgba(color.MAX_DARK, 0.8),
        }}
        onClick={() => updateState({ isFullScreen: true })}
      >
        <SlackIcon icon="expand" />
      </IconButtonCustom>
    </Tooltip>
  );
};

export default PlayerExpand;
