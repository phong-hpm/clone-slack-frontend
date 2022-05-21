import { FC, useContext, useRef, useState } from "react";

// components
import { Tooltip } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import IconButtonCustom from "./IconButtonCustom";
import MoreMenu from "components/MediaPlayer/MoreMenu";

// context
import { VideoPlayerContext } from "../VideoPlayerContext";

// constants
import { color, rgba } from "utils/constants";

export interface PlayerMoreActionProps {
  onClickDelete?: () => void;
}

const PlayerMoreAction: FC<PlayerMoreActionProps> = ({ onClickDelete }) => {
  const { state } = useContext(VideoPlayerContext);

  const moreButtonRef = useRef<HTMLButtonElement>(null);

  const [isShowMoreMenu, setShowMoreMenu] = useState(false);

  return (
    <>
      <Tooltip title="More actions">
        <IconButtonCustom
          ref={moreButtonRef}
          sx={{
            background: state.isFullScreen ? "transparent" : rgba(color.SECONDARY_BACKGROUND, 0.8),
          }}
          onClick={() => setShowMoreMenu(true)}
        >
          <SlackIcon icon={state.isFullScreen ? "ellipsis" : "vertical-ellipsis"} />
        </IconButtonCustom>
      </Tooltip>

      <MoreMenu
        open={isShowMoreMenu}
        type="video"
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
        onClickDelete={onClickDelete}
        onClose={() => setShowMoreMenu(false)}
      />
    </>
  );
};

export default PlayerMoreAction;
