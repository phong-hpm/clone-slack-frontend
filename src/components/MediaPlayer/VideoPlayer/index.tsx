import { VideoProps } from "components/Video";
import { FC, useRef, useState } from "react";

// components
import FullScreenModal from "./FullScreenModal";
import PlayerBase from "./PlayerBase";

// context
import { VideoPlayerContextProvider } from "./VideoPlayerContext";

// types
import { PlayerBaseInstance } from "./_types";
import { VideoPlayerDataType } from "./_types";

export interface VideoPlayerProps {
  ratio?: number;
  style?: React.CSSProperties;
  controlStyle?: React.CSSProperties;
  videoProps?: VideoProps;
  data: Partial<VideoPlayerDataType>;
  onEditThumbnail?: () => void;
  onDelete?: () => void;
}

const VideoPlayer: FC<VideoPlayerProps> = ({
  videoProps,
  style,
  controlStyle,
  data,
  ratio,
  onEditThumbnail,
  onDelete,
}) => {
  const playerBaseInstanceRef = useRef<PlayerBaseInstance>({
    video: { videoEl: null, containerEl: null },
    containerEl: null,
  });

  const [containerEl, setContainerEl] = useState<HTMLDivElement | null>(null);

  return (
    <VideoPlayerContextProvider dataProps={data}>
      <PlayerBase
        ref={playerBaseInstanceRef}
        ratio={ratio}
        style={style}
        controlStyle={controlStyle}
        portalEl={containerEl}
        videoProps={videoProps}
        onEditThumbnail={onEditThumbnail}
        onDelete={onDelete}
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
