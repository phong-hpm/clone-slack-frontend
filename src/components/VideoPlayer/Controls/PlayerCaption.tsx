import { FC, useContext } from "react";

// components
import { Tooltip } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import IconButtonCustom from "./IconButtonCustom";

// context
import { VideoPlayerContext } from "../VideoPlayerContext";

export interface PlayerCaptionProps {}

const PlayerCaption: FC<PlayerCaptionProps> = () => {
  const { state, updateState } = useContext(VideoPlayerContext);

  return (
    <Tooltip title={`Turn ${state.isCaption ? "off" : "on"} captions`}>
      <IconButtonCustom onClick={() => updateState({ isCaption: !state.isCaption })}>
        <SlackIcon icon={state.isCaption ? "cc-filled" : "cc"} />
      </IconButtonCustom>
    </Tooltip>
  );
};

export default PlayerCaption;
