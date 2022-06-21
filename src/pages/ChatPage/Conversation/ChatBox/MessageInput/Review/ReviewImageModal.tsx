import { FC, useState } from "react";

// components
import { Modal, ModalHeader, ModalBody, ModalProps } from "components/Modal";
import { Box, IconButton, Slider, SxProps, Tooltip } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color, rgba } from "utils/constants";

export interface ReviewImageModalProps extends ModalProps {
  url: string;
}

const ReviewImageModal: FC<ReviewImageModalProps> = ({ url, ...props }) => {
  const [zoom, setZoom] = useState(100);
  const [rotate, setRotate] = useState(0);

  const iconButtonXS: SxProps = {
    borderRadius: 1,
    bgcolor: rgba(color.DARK, 0.7),
    ":hover": { bgcolor: rgba(color.DARK, 0.7) },
  };

  return (
    <Modal className="modal-full" isCloseBtn IconCloseProps={{ top: 20, right: 20 }} {...props}>
      <ModalHeader py={2.5} isBorder />

      <ModalBody position="relative" p={6}>
        <Box display="flex" alignItems="center" minHeight="100%" minWidth="100%">
          <img
            src={url}
            alt=""
            style={{
              zoom: zoom / 100,
              margin: "0 auto",
              width: "auto",
              height: "auto",
              maxWidth: `${zoom}%`,
              maxHeight: `${zoom}%`,
              transform: `rotate(${rotate}deg)`,
            }}
          />
        </Box>

        <Box
          position="absolute"
          sx={{ left: "50%", top: "calc(100% - 50px)", transform: "translateX(-50%)" }}
        >
          <Box display="flex">
            {/* Rotate image */}
            <Tooltip title="Rotate">
              <IconButton sx={iconButtonXS} onClick={() => setRotate(rotate + 90)}>
                <SlackIcon icon="repeat" />
              </IconButton>
            </Tooltip>

            <Box display="flex" borderRadius={1} bgcolor={rgba(color.DARK, 0.7)} mx={1}>
              {/* Zoom out, step = -50 */}
              <Tooltip title="Zoom out">
                <IconButton
                  sx={{ ...iconButtonXS, bgcolor: "transparent" }}
                  onClick={() => setZoom(Math.max(100, zoom - 50))}
                >
                  <SlackIcon icon="minus" />
                </IconButton>
              </Tooltip>

              {/* Zoom slider */}
              <Tooltip title={`${zoom}%`}>
                <Slider
                  size="small"
                  value={zoom}
                  min={100}
                  max={200}
                  sx={{ width: 64, mx: 1 }}
                  onChange={(_, value) => setZoom(value as number)}
                />
              </Tooltip>

              {/* Zoom in, step = 50 */}
              <Tooltip title="Zoom in">
                <IconButton
                  sx={{ ...iconButtonXS, bgcolor: "transparent" }}
                  onClick={() => setZoom(Math.min(200, zoom + 50))}
                >
                  <SlackIcon icon="plus" />
                </IconButton>
              </Tooltip>
            </Box>

            {/* Reset to zoom = 1 */}
            <Tooltip title="Reset">
              <IconButton
                sx={{ ...iconButtonXS, visibility: zoom > 100 ? "visible" : "hidden" }}
                onClick={() => setZoom(100)}
              >
                <SlackIcon icon="collapse-vertical" style={{ transform: "rotate(45deg)" }} />
              </IconButton>
            </Tooltip>
          </Box>
        </Box>
      </ModalBody>
    </Modal>
  );
};

export default ReviewImageModal;
