import { forwardRef, useContext, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";

// components
import { Box } from "@mui/material";
import Video, { VideoProps } from "components/Video";
import PlayerProgressBar from "./Controls/PlayerProgressBar";
import PlayerPlayPause from "./Controls/PlayerPlayPause";
import PlayerVolume from "./Controls/PlayerVolume";
import PlayerSpeed from "./Controls/PlayerSpeed";
import PlayerMoreAction from "./Controls/PlayerMoreAction";
import PlayerCaption from "./Controls/PlayerCaption";
import PlayerOpenIn from "./Controls/PlayerOpenIn";
import PlayerDuration from "./Controls/PlayerDuration";
import PlayerTranscript from "./Controls/PlayerTranscript";
import PlayerExpand from "./Controls/PlayerExpand";

// context
import { VideoPlayerContext } from "./VideoPlayerContext";

// utils
import { color } from "utils/constants";

// constants
import { bgControl } from "./_constants";

// types
import { PlayerBaseInstance } from "./_types";
import { VideoInstance } from "components/Video/_types";

export interface PlayerBaseProps {
  ratio?: number;
  style?: React.CSSProperties;
  controlStyle?: React.CSSProperties;
  portalEl?: HTMLDivElement | null;
  videoProps?: VideoProps;
  onEditThumbnail?: () => void;
  onDelete?: () => void;
}

const PlayerBase = forwardRef<PlayerBaseInstance, PlayerBaseProps>(
  ({ ratio, videoProps, style, controlStyle, portalEl, onEditThumbnail, onDelete }, ref) => {
    const { state, updateState } = useContext(VideoPlayerContext);

    const videoInstanceRef = useRef<VideoInstance>({ videoEl: null, containerEl: null });
    const containerRef = useRef<HTMLDivElement>(null);

    const [isHover, setHover] = useState(state.isFullScreen);

    useImperativeHandle(ref, () => ({
      video: videoInstanceRef.current,
      containerEl: containerRef.current,
    }));

    const handleChangeProgressSlider = (value: number) => {
      if (value !== state.currentTime && videoInstanceRef.current.videoEl) {
        updateState({ currentTime: value });
        videoInstanceRef.current.videoEl.currentTime = value;
      }
    };

    const handleChangeVolumeSlider = (value: number) => {
      if (value !== state.volume && videoInstanceRef.current.videoEl) {
        updateState({ volume: value });
        videoInstanceRef.current.videoEl.volume = value / 10;
      }
    };

    const handleChangeSpeed = (value: string) => {
      if (!videoInstanceRef.current.videoEl) return;
      updateState({ speed: value });
      videoInstanceRef.current.videoEl.playbackRate = Number(value);
    };

    const handlePlayPause = () => {
      if (state.isPlaying) videoInstanceRef.current.videoEl?.pause();
      else videoInstanceRef.current.videoEl?.play();
    };

    const renderControls = () => {
      if (!state.src || state.status === "uploading") return <></>;

      return (
        <Box
          position="absolute"
          zIndex={500}
          top={state.isFullScreen ? "auto" : 0}
          bottom={0}
          left={0}
          right={0}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p={2}
          sx={{ backgroundImage: isHover && !state.isFullScreen ? bgControl : undefined }}
          style={controlStyle}
          onMouseOver={() => setHover(true)}
          onMouseLeave={() => setHover(state.isFullScreen)}
        >
          {/* top controls */}
          {isHover && !state.isFullScreen && (
            <Box>
              <Box display="flex" justifyContent="end">
                <PlayerExpand />
                <PlayerMoreAction onClickEditThumbnail={onEditThumbnail} onClickDelete={onDelete} />
              </Box>
            </Box>
          )}

          {/* free space */}
          <Box flex="1" onClick={handlePlayPause} />

          {/* bottom controls */}
          <Box>
            {isHover && <PlayerProgressBar onChange={handleChangeProgressSlider} />}

            {/* actions */}
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                <PlayerPlayPause isHover={isHover} onClick={handlePlayPause} />
                {isHover && <PlayerVolume onChange={handleChangeVolumeSlider} />}
                {state.isFullScreen && <PlayerDuration />}
              </Box>

              {/* right actions */}
              {isHover && (
                <Box>
                  <PlayerSpeed onChange={handleChangeSpeed} />
                  <PlayerCaption />
                  <PlayerTranscript onChange={handleChangeProgressSlider} />
                  {state.isFullScreen && <PlayerOpenIn />}
                  {state.isFullScreen && (
                    <PlayerMoreAction
                      onClickEditThumbnail={onEditThumbnail}
                      onClickDelete={onDelete}
                    />
                  )}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      );
    };

    return (
      <>
        <Box
          ref={containerRef}
          position={state.isFullScreen ? undefined : "relative"}
          width="100%"
          color={color.LIGHT}
          bgcolor={state.isFullScreen ? undefined : color.SECONDARY_BACKGROUND}
          style={style}
        >
          {/* 
            CAN NOT use portal for [Video], because portal will re-mount [Video] component
              -> [Video] CAN NOT playing continously after move to [FullScreenModal]
          */}
          <Video
            ref={videoInstanceRef}
            src={state.src}
            poster={state.thumbnail}
            ratio={ratio}
            setPlaying={(bol) => updateState({ isPlaying: bol })}
            onTimeUpdate={(event) => {
              const value = (event.target as HTMLVideoElement).currentTime;
              updateState({ currentTime: value });
            }}
            onVolumeChange={(event) => {
              const value = (event.target as HTMLVideoElement).volume * 10;
              updateState({ volume: value });
            }}
            {...videoProps}
          />
        </Box>

        {/* controls portal */}
        {/* using [reactPortal] will help control elements can contol state in this component */}
        {(portalEl || containerRef.current) &&
          createPortal(renderControls(), portalEl || containerRef.current!)}
      </>
    );
  }
);

export default PlayerBase;
