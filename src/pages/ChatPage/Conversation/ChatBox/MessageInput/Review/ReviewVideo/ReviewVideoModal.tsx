import { FC, useState } from "react";

// components
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalProps } from "components/Modal";
import { Box, Button, Slider, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import Video from "components/Video";

// utils
import { color } from "utils/constants";
import { buildProgressTime } from "utils/waveSurver";

// types
import { MessageFileType } from "store/slices/_types";

export interface ReviewVideoModalProps extends ModalProps {
  file: MessageFileType;
  onRepeat?: () => void;
  onThumbnail?: () => void;
  onDownload?: () => void;
  onDone?: () => void;
}

const ReviewVideoModal: FC<ReviewVideoModalProps> = ({
  file,
  onRepeat,
  onDownload,
  onThumbnail,
  onDone,
  ...props
}) => {
  const [videoElement, setVideoElement] = useState<HTMLVideoElement | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setPlaying] = useState(false);

  const handleChangeSlider = (value: number) => {
    if (value !== currentTime && videoElement) {
      setCurrentTime(value);
      videoElement.currentTime = value;
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      videoElement?.pause();
    } else {
      videoElement?.play();
    }
  };

  return (
    <Modal
      isCloseBtn
      className="modal-record"
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      transformOrigin={{ horizontal: "center", vertical: "bottom" }}
      transformExtra={{ vertical: 8 }}
      {...props}
    >
      <ModalHeader py={1.5}>
        {onRepeat && (
          <Box display="flex" width="100%" justifyContent="end">
            {/* start over button */}
            <Button color="error" size="medium" sx={{ ml: -1.25 }} onClick={onRepeat}>
              <SlackIcon icon="repeat" />
              <Typography fontWeight={700} color={color.HIGH} sx={{ ml: 1 }}>
                Start Over
              </Typography>
            </Button>
          </Box>
        )}
      </ModalHeader>

      <ModalBody py={6}>
        <Video
          ref={setVideoElement}
          src={file.url}
          poster={file.thumb}
          ratio={9 / 16}
          style={{ borderRadius: 8 }}
          onPause={() => setPlaying(false)}
          onPlaying={() => setPlaying(true)}
          onTimeUpdate={(event) =>
            setCurrentTime(Math.floor((event.target as HTMLVideoElement).currentTime))
          }
        />
      </ModalBody>

      <ModalFooter>
        <Slider
          value={currentTime}
          min={0}
          max={file.duration}
          onChange={(_, value) => handleChangeSlider(value as number)}
        />

        <Box display="flex" justifyContent="space-between">
          <Box display="flex" ml={-2} mr={2}>
            {/* play/pause button */}
            <Button color="error" size="medium" onClick={handlePlayPause}>
              <SlackIcon icon={isPlaying ? "pause" : "play"} />
            </Button>
            {/* video timing */}
            <Typography lineHeight={2.5} sx={{ ml: 1 }}>
              {`${buildProgressTime(currentTime)} / ${buildProgressTime(file.duration)}`}
            </Typography>
          </Box>

          {/* thumbnail button */}
          {onThumbnail && (
            <Button color="error" size="large" onClick={onThumbnail}>
              <SlackIcon icon="image" />
              <Typography fontWeight={700} color={color.HIGH} sx={{ ml: 1 }}>
                Select thumbnail
              </Typography>
            </Button>
          )}

          {/* download button */}
          {onDownload && (
            <Button color="error" size="large" onClick={onDownload}>
              <SlackIcon icon="cloud-download" />
              <Typography fontWeight={700} color={color.HIGH} sx={{ ml: 1 }}>
                Download
              </Typography>
            </Button>
          )}

          {/* done button */}
          {!!onDone && (
            <Button variant="contained" color="primary" size="large" onClick={onDone}>
              Done
            </Button>
          )}
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default ReviewVideoModal;
