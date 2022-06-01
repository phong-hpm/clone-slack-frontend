import { FC, useContext, useRef, useState } from "react";

// components
import { Tooltip } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import IconButtonCustom from "./IconButtonCustom";
import MoreMenu, { MoreMenuProps } from "components/MediaPlayer/MoreMenu";

// context
import { VideoPlayerContext } from "../VideoPlayerContext";

// constants
import { color, rgba } from "utils/constants";

export interface PlayerMoreActionProps
  extends Pick<MoreMenuProps, "onClickEditThumbnail" | "onClickDelete"> {}

const PlayerMoreAction: FC<PlayerMoreActionProps> = (props) => {
  const { state } = useContext(VideoPlayerContext);

  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const [isShowMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <>
      <Tooltip title="More actions">
        <IconButtonCustom
          ref={moreButtonRef}
          sx={{
            background: state.isFullScreen ? "transparent" : rgba(color.MAX_DARK, 0.8),
          }}
          onClick={() => setShowMoreMenu(true)}
        >
          <SlackIcon icon={state.isFullScreen ? "ellipsis" : "vertical-ellipsis"} />
        </IconButtonCustom>
      </Tooltip>

      <MoreMenu
        open={isShowMoreMenu}
        type="video"
        url={state.src}
        anchorEl={moreButtonRef.current}
        anchorOrigin={
          state.isFullScreen
            ? { vertical: "top", horizontal: "right" }
            : { vertical: "top", horizontal: "left" }
        }
        transformOrigin={
          state.isFullScreen
            ? { vertical: "bottom", horizontal: "right" }
            : { vertical: "top", horizontal: "right" }
        }
        onClose={() => setShowMoreMenu(false)}
        {...props}
      />
    </>
  );
};

export default PlayerMoreAction;
