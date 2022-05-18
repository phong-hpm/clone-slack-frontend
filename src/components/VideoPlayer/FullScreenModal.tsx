import { FC, useRef } from "react";

// components
import { Box } from "@mui/material";
import { Modal, ModalBody, ModalProps } from "components/Modal";

// utils
import { color, rgba } from "utils/constants";
import PlayerBase, { PlayerBaseProps } from "./PlayerBase";

// types

export interface FullScreenModalProps extends ModalProps {
  playerProps?: PlayerBaseProps;
}

const FullScreenModal: FC<FullScreenModalProps> = ({ playerProps, ...props }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const computeVideoSize = () => {
    if (!videoRef.current || !containerRef.current) return;
    const { width: containerWidth, height: containerHeight } =
      containerRef.current.getBoundingClientRect();
    if (videoRef.current) {
      videoRef.current.style.maxWidth = `${containerWidth}px`;
      videoRef.current.style.maxHeight = `${containerHeight}px`;
      videoRef.current.style.opacity = `1`;
    }
  };

  const handleAfterOpen = () => {
    if (!containerRef.current) return;
    const containerEl = containerRef.current;
    computeVideoSize();
    const observer = new ResizeObserver(() => {
      computeVideoSize();
    });
    observer.observe(containerEl);
  };

  return (
    <Modal className="modal-full" isCloseBtn onAfterOpen={handleAfterOpen} {...props}>
      <ModalBody height="100%" p={0}>
        <Box
          id="container"
          ref={containerRef}
          width="100%"
          height="100%"
          display="flex"
          justifyContent="center"
          alignItems="center"
          bgcolor={rgba(color.DARK, 0.5)}
        >
          <PlayerBase
            ref={videoRef}
            {...playerProps}
            isFullScreen
            // set opacity to wait for setting max-width and max-height
            videoProps={{ style: { opacity: 0, width: "100%", height: "100%" } }}
          />
        </Box>
      </ModalBody>
    </Modal>
  );
};

export default FullScreenModal;
