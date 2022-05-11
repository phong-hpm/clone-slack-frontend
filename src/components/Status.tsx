import { FC } from "react";

// utils
import { color } from "utils/constants";

// components
import SlackIcon, { SlackIconProps } from "./SlackIcon";

export interface StatusProps extends Omit<SlackIconProps, "icon"> {
  isOnline?: boolean;
}

const Status: FC<StatusProps> = ({ isOnline, fontSize = "small" }) => {
  return (
    <SlackIcon
      color={isOnline ? color.SUCCESS : color.MAX_SOLID}
      fontSize={fontSize}
      icon={isOnline ? "presence-online" : "presence-offline"}
    />
  );
};

export default Status;
