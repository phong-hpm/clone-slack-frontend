import { FC, useEffect, useRef, useState } from "react";

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
import { VideoInstance } from "components/Video/_types";
import { createThumbnails } from "utils/videoRecorder";
import LoadingWrapper from "components/LoadingWrapper";

export interface ReviewVideoModalProps extends ModalProps {
  file: MessageFileType;
  onStartOver?: () => void;
  onThumbnail?: () => void;
  onUpdateThumbList?: (thumbList: string[]) => void;
  onDownload?: () => void;
  onDone?: () => void;
}

const ReviewVideoModal: FC<ReviewVideoModalProps> = ({
  isOpen,
  file,
  onStartOver,
  onUpdateThumbList,
  onDownload,
  onThumbnail,
  onDone,
  ...props
}) => {
  const videoInstanceRef = useRef<VideoInstance>({ videoEl: null, containerEl: null });
  const [currentTime, setCurrentTime] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [isPrepraing, setPreparing] = useState(false);

  const handleChangeSlider = (value: number) => {
    if (value !== currentTime && videoInstanceRef.current.videoEl) {
      setCurrentTime(value);
      videoInstanceRef.current.videoEl.currentTime = value;
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      videoInstanceRef.current.videoEl?.pause();
    } else {
      videoInstanceRef.current.videoEl?.play();
    }
  };

  useEffect(() => {
    if (!file.url || file.thumbList?.length || !onUpdateThumbList) return;
    setPreparing(true);

    createThumbnails({ src: file.url }).then((thumbs) => {
      onUpdateThumbList && onUpdateThumbList(thumbs);
      setPreparing(false);
    });
  }, [file.url, file.thumbList, onUpdateThumbList]);

  return (
    <Modal
      isOpen={isOpen}
      isCloseBtn
      className="modal-record"
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      transformOrigin={{ horizontal: "center", vertical: "bottom" }}
      transformExtra={{ vertical: 8 }}
      IconCloseProps={{ top: 20, right: 20 }}
      {...props}
    >
      <ModalHeader py={2.5}>
        {onStartOver && (
          <Box display="flex" width="100%" justifyContent="end">
            {/* start over button */}
            <Button variant="text" size="medium" sx={{ ml: -1.25 }} onClick={onStartOver}>
              <SlackIcon icon="repeat" />
              <Typography fontWeight={700} color={color.HIGH} sx={{ ml: 1 }}>
                Start Over
              </Typography>
            </Button>
          </Box>
        )}
      </ModalHeader>

      <ModalBody py={6}>
        <LoadingWrapper isLoading={isPrepraing}>
          <Video
            ref={videoInstanceRef}
            src={file.url}
            poster={file.thumb}
            ratio={9 / 16}
            style={{ borderRadius: 8 }}
            setPlaying={setPlaying}
            onTimeUpdate={(event) =>
              setCurrentTime(Math.floor((event.target as HTMLVideoElement).currentTime))
            }
          />
        </LoadingWrapper>
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
            <Button variant="text" size="medium" disabled={isPrepraing} onClick={handlePlayPause}>
              <SlackIcon icon={isPlaying ? "pause" : "play"} />
            </Button>
            {/* video timing */}
            <Typography lineHeight={2.5} sx={{ ml: 1 }}>
              {`${buildProgressTime(currentTime)} / ${buildProgressTime(file.duration)}`}
            </Typography>
          </Box>

          {/* thumbnail button */}
          {onThumbnail && (
            <Button
              variant="text"
              size="large"
              disabled={isPrepraing}
              sx={{ color: color.HIGH }}
              onClick={onThumbnail}
            >
              <SlackIcon icon="image" />
              <Typography fontWeight={700} sx={{ ml: 1 }}>
                Select thumbnail
              </Typography>
            </Button>
          )}

          {/* download button */}
          {onDownload && (
            <Button
              variant="text"
              size="large"
              disabled={isPrepraing}
              sx={{ color: color.HIGH }}
              onClick={onDownload}
            >
              <SlackIcon icon="cloud-download" />
              <Typography fontWeight={700} sx={{ ml: 1 }}>
                Download
              </Typography>
            </Button>
          )}

          {/* done button */}
          {!!onDone && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={isPrepraing}
              onClick={onDone}
            >
              Done
            </Button>
          )}
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default ReviewVideoModal;
