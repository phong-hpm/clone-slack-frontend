import { FC, useContext, useRef, useState } from "react";

// components
import { Tooltip } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import MoreMenu from "./MoreMenu";
import IconButtonCustom from "../IconButtonCustom";

// context
import { VideoPlayerContext } from "../../VideoPlayerContext";

// constants
import { color, rgba } from "utils/constants";

export interface PlayerMoreActionProps {}

const PlayerMoreAction: FC<PlayerMoreActionProps> = () => {
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
      />
    </>
  );
};

export default PlayerMoreAction;
