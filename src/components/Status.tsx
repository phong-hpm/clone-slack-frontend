import { FC } from "react";

// components
import SlackIcon, { SlackIconProps } from "./SlackIcon";

// utils
import { color } from "utils/constants";

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
