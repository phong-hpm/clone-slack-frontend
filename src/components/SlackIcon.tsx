import { FC } from "react";
import classnames from "classnames";

// utils
import { iconImgName } from "utils/constants";

export interface SlackIconProps {
  icon: string;
  isSpinner?: boolean;
  fontSize?: "inherit" | "small" | "medium" | "large";
  color?: string;
  cursor?: string;
  style?: React.CSSProperties;
  className?: string;
}

const SlackIcon: FC<SlackIconProps> = ({
  icon,
  isSpinner,
  color,
  cursor,
  fontSize,
  style,
  className,
  children,
}) => {
  const classes = classnames(
    fontSize && `c-icon-fontsize-${fontSize}`,
    isSpinner && "c-icon-spinner",
    className
  );

  if (!iconImgName.includes(icon)) {
    return (
      <i
        className={classnames("c-icon", icon && `c-icon--${icon}`, classes)}
        style={{ ...style, color, cursor }}
      >
        {children}
      </i>
    );
  }

  return (
    <span
      role="img"
      className={classnames("c-icon-img", classes)}
      data-ndw={icon}
      style={{ ...style, color }}
    >
      {children}
    </span>
  );
};

export default SlackIcon;
