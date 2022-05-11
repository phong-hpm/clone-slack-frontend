import { FC } from "react";
import classnames from "classnames";

// utils
import { iconName, iconImgName } from "utils/constants";

export interface SlackIconProps {
  fontSize?: "inherit" | "small" | "medium" | "large";
  color?: string;
  cursor?: string;
  icon: typeof iconName[number] | typeof iconImgName[number];
}

const SlackIcon: FC<SlackIconProps> = ({ icon, color, cursor, fontSize }) => {
  if (!iconImgName.includes(icon)) {
    return (
      <i
        className={classnames(
          "c-icon",
          icon && `c-icon--${icon}`,
          fontSize && `c-icon-fontsize-${fontSize}`
        )}
        style={{ color, cursor }}
      />
    );
  }

  return (
    <span
      role="img"
      className={classnames("c-icon-img", fontSize && `c-icon-fontsize-${fontSize}`)}
      data-ndw={icon}
      style={{ color }}
    />
  );
};

export default SlackIcon;
