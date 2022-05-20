import { VideoProps } from "components/Video";
import { FC, useRef, useState } from "react";

// components
import FullScreenModal from "./FullScreenModal";
import PlayerBase from "./PlayerBase";

// context
import { VideoPlayerContextProvider } from "./VideoPlayerContext";

// types
import { PlayerBaseInstance } from "./_types";
import { VideoPlayerProviderDataProps } from "./_types";

export interface VideoPlayerProps extends Partial<VideoPlayerProviderDataProps> {
  videoProps?: VideoProps;
  style?: React.CSSProperties;
  controlStyle?: React.CSSProperties;
}

const VideoPlayer: FC<VideoPlayerProps> = ({ videoProps, style, controlStyle, ...props }) => {
  const playerBaseInstanceRef = useRef<PlayerBaseInstance>({
    video: { videoEl: null, containerEl: null },
    containerEl: null,
  });

  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);

  return (
    <VideoPlayerContextProvider dataProps={props}>
      <PlayerBase
        ref={playerBaseInstanceRef}
        portalEl={containerEl}
        videoProps={videoProps}
        style={style}
        controlStyle={controlStyle}
        {...props}
      />

      <FullScreenModal
        playerInstance={playerBaseInstanceRef.current}
        onAfterOpen={setContainerEl}
        onClose={() => setContainerEl(null)}
      />
    </VideoPlayerContextProvider>
  );
};

export default VideoPlayer;
