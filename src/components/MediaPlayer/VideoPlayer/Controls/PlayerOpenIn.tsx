import { FC } from "react";

// components
import { Tooltip } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import IconButtonCustom from "./IconButtonCustom";

export interface PlayerOpenInProps {}

const PlayerOpenIn: FC<PlayerOpenInProps> = () => {
  return (
    <Tooltip title="Open in...">
      <IconButtonCustom>
        <SlackIcon icon="new-window" />
      </IconButtonCustom>
    </Tooltip>
  );
};

export default PlayerOpenIn;
