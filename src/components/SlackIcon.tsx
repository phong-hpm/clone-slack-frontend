import { FC } from "react";
import classnames from "classnames";

// utils
import { iconImgName } from "utils/constants";

export interface SlackIconProps {
  icon: string;
  fontSize?: "inherit" | "small" | "medium" | "large";
  color?: string;
  cursor?: string;
  style?: React.CSSProperties;
}

const SlackIcon: FC<SlackIconProps> = ({ icon, color, cursor, fontSize, style }) => {
  if (!iconImgName.includes(icon)) {
    return (
      <i
        className={classnames(
          "c-icon",
          icon && `c-icon--${icon}`,
          fontSize && `c-icon-fontsize-${fontSize}`
        )}
        style={{ ...style, color, cursor }}
      />
    );
  }

  return (
    <span
      role="img"
      className={classnames("c-icon-img", fontSize && `c-icon-fontsize-${fontSize}`)}
      data-ndw={icon}
      style={{ ...style, color }}
    />
  );
};

export default SlackIcon;
