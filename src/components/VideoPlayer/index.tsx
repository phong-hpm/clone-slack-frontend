import { useState } from "react";

// components
import FullScreenModal from "./FullScreenModal";
import PlayerBase, { PlayerBaseProps } from "./PlayerBase";

export interface VideoPlayerProps extends PlayerBaseProps {}

const VideoPlayer = ({ ...props }) => {
  const [isShowFullScreenModal, setShowFullScreenModal] = useState(false);

  return (
    <>
      <PlayerBase {...props} onClickExpand={() => setShowFullScreenModal(true)} />

      <FullScreenModal
        isOpen={isShowFullScreenModal}
        playerProps={{ ...props, style: { ...props.style, maxWidth: "100%" } }}
        onClose={() => setShowFullScreenModal(false)}
      />
    </>
  );
};

export default VideoPlayer;
