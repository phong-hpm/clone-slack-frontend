import { FC } from "react";

const iconImgName = ["ellipsis-vertical-filled", "close", "close-small", "compose"];

export interface SlackIconProps {
  fontSize?: "inherit" | "small" | "meidum" | "large";
  icon:
    | "caret-right"
    | "caret-down"
    | "plus"
    | "plus-small"
    | "channel-pane-hash"
    | "mentions"
    | "more-vert"
    | "buildings"
    | "mentions"
    | "hash-medium-bold"
    | "chevron-down"
    | "lock"
    | "channel"
    | "form-checkbox-check"

    // icon images
    | "ellipsis-vertical-filled"
    | "close"
    | "close-small"
    | "compose";
}

const SlackIcon: FC<SlackIconProps> = ({ icon, fontSize }) => {
  return iconImgName.includes(icon) ? (
    <span
      role="img"
      className={`c-icon-img ${fontSize && `c-icon-fontsize-${fontSize}`}`}
      data-ndw={icon}
    />
  ) : (
    <i className={`c-icon ${fontSize && `c-icon-fontsize-${fontSize}`} c-icon--${icon}`} />
  );
};

export default SlackIcon;
