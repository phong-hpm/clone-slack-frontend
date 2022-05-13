import { FC, useEffect, useRef, useState } from "react";

// components
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalProps } from "components/Modal";
import { Box, Button, Typography, IconButton } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color, resolutions, deviceKind } from "utils/constants";
import { createCameraRecorder, createShareScreenRecorder } from "utils/videoRecorder";

// context
import RecordSettingMenu from "./RecordSettingMenu";

// types
import { MediaDeviceInfoType } from "../_types";
import { ResolutionType } from "utils/_types";
import { MessageFileType } from "store/slices/_types";
import Video from "components/Video";

export interface RecordModalProps extends ModalProps {
  onNext: (file: MessageFileType) => void;
}

const RecordModal: FC<RecordModalProps> = ({ isOpen, onClose, onNext, ...props }) => {
  const keepRef = useRef<{
    file?: MessageFileType;
    videoWidth?: number;
    mediaRecoder?: MediaRecorder;
    devices?: MediaDeviceInfoType[];
    resolution: ResolutionType;
  }>({ resolution: resolutions[0] });
  const settingButtonRef = useRef<HTMLButtonElement>(null);

  // storing stream in state to trigger some useEffect
  const [cameraStream, setCameraStream] = useState<MediaStream | undefined>();
  const [shareScreenStream, setShareScreenStream] = useState<MediaStream | undefined>();
  const [cameraElement, setCameraElement] = useState<HTMLVideoElement | null>(null);
  const [shareScreenElement, setShareScreenElement] = useState<HTMLVideoElement | null>(null);
  const [selectedAudioId, setSelectedAudioId] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");

  const [isRecording, setRecording] = useState(false);
  const [isShareScreen, setShareScreen] = useState(false);
  const [isEnabledAudio, setEnabledAudio] = useState(true);
  const [isEnabledVideo, setEnabledVideo] = useState(true);
  const [isShowSettingMenu, setShowSettingMenu] = useState(false);

  const handleStopRecord = () => {
    const { mediaRecoder } = keepRef.current;
    // stop camera stream
    cameraStream?.getTracks().forEach((track) => track.stop());
    // stop sharescreen stream
    shareScreenStream?.getTracks().forEach((track) => track.stop());
    // stop camera recoder
    mediaRecoder?.state === "recording" && mediaRecoder.stop();

    setRecording(false);
  };

  const handleDoneRecord = () => {
    handleStopRecord();
    // setTimeout will be call after mediaRecoder.onstop
    setTimeout(() => {
      if (keepRef.current.file) onNext(keepRef.current.file);
    }, 1);
  };

  const handleClose = () => {
    handleStopRecord();
    onClose();
  };

  const handleStartRecord = () => {
    if (keepRef.current.mediaRecoder) {
      keepRef.current.mediaRecoder.start();
      setRecording(true);
    }
  };

  // reset sharescreen state after close modal
  useEffect(() => {
    if (!isOpen) setShareScreen(false);
  }, [isOpen]);

  // stop sharescreen stream when isShareScreen state be false
  useEffect(() => {
    if (!isShareScreen) {
      shareScreenStream?.getTracks().forEach((track) => track.stop());
    }
  }, [isShareScreen, shareScreenStream]);

  // set default device ids
  useEffect(() => {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      keepRef.current.devices = devices;
      const videoDevices = devices.filter((device) => device.kind === deviceKind.CAMERA);
      const audioDevices = devices.filter((device) => device.kind === deviceKind.MICROPHONE);
      setSelectedVideoId(videoDevices[0].deviceId);
      setSelectedAudioId(audioDevices[0].deviceId);
    });
  }, []);

  // toggle audio stream
  useEffect(() => {
    cameraStream?.getAudioTracks().forEach((track) => (track.enabled = isEnabledAudio));
    shareScreenStream?.getAudioTracks().forEach((track) => (track.enabled = isEnabledAudio));
  }, [isEnabledAudio, cameraStream, shareScreenStream]);

  // toggle video stream
  useEffect(() => {
    cameraStream?.getVideoTracks().forEach((track) => (track.enabled = isEnabledVideo));
  }, [cameraStream, isEnabledVideo]);

  // close setting menu after changing selected device
  useEffect(() => setShowSettingMenu(false), [selectedAudioId, selectedVideoId]);

  // create recorder after video element rendered
  useEffect(() => {
    if (!cameraElement || !selectedAudioId || !selectedVideoId) return;
    createCameraRecorder(
      selectedAudioId,
      selectedVideoId,
      keepRef.current.resolution,
      (file: MessageFileType) => (keepRef.current.file = file)
    ).then(({ mediaRecoder, stream }) => {
      cameraElement.volume = 0;
      cameraElement.autoplay = true;
      cameraElement.srcObject = stream;

      keepRef.current.mediaRecoder = mediaRecoder;
      setCameraStream(stream);
    });
  }, [selectedAudioId, selectedVideoId, cameraElement]);

  // create recorder after video element rendered
  useEffect(() => {
    if (!isShareScreen || !shareScreenElement || !selectedAudioId || !selectedVideoId) return;
    createShareScreenRecorder(
      selectedAudioId,
      selectedVideoId,
      keepRef.current.resolution,
      (file: MessageFileType) => (keepRef.current.file = file)
    ).then(({ mediaRecoder, stream }) => {
      shareScreenElement.volume = 0;
      shareScreenElement.autoplay = true;
      shareScreenElement.srcObject = stream;

      keepRef.current.mediaRecoder = mediaRecoder;
      setShareScreenStream(stream);
    });
  }, [isShareScreen, selectedAudioId, selectedVideoId, shareScreenElement]);

  // resize height to fit width and resolution
  useEffect(() => {
    if (!cameraElement) return;

    const observer = new ResizeObserver((entries) => {
      const entry = entries[0];
      if (entry.target) {
        const { width } = entry.target.getBoundingClientRect();
        const { resolution } = keepRef.current;
        const height = (width * resolution.height) / resolution.width;
        cameraElement.style.height = `${height}px`;
      }
    });

    observer.observe(cameraElement);
    return () => observer.unobserve(cameraElement);
  }, [cameraElement]);

  return (
    <Modal
      isCloseBtn
      className="modal-record"
      isOpen={isOpen}
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      transformOrigin={{ horizontal: "center", vertical: "bottom" }}
      transformExtra={{ vertical: 8 }}
      onClose={handleClose}
      {...props}
    >
      <ModalHeader isBorder>
        <Typography variant="h3">Record video clip</Typography>
      </ModalHeader>

      {/* video */}
      <ModalBody py={6}>
        <Box position="relative" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Video
            ref={setShareScreenElement}
            // sharescreen video can not apply any fixed resolution
            // size of sharecreen video have to fit with user's monitor
            // ratio={keepRef.current.resolution.height / keepRef.current.resolution.width}
            style={{ display: isShareScreen ? "block" : "none" }}
          />
          <Video
            ref={setCameraElement}
            ratio={keepRef.current.resolution.height / keepRef.current.resolution.width}
            boxProps={{
              width: isShareScreen ? 100 : "100%",
              position: isShareScreen ? "absolute" : "relative",
              right: isShareScreen ? 20 : 0,
              top: isShareScreen ? 20 : 0,
              display: isShareScreen && !isEnabledVideo ? "none" : "block",
            }}
          />

          {/* video actions */}
          <Box
            position="absolute"
            bottom={0}
            left={0}
            right={0}
            display="none"
            // display="flex"
            p={1}
            sx={{ background: "linear-gradient(transparent,rgba(0,0,0,.6))" }}
          >
            {/* toggle video */}
            <IconButton
              className="bg-gray"
              size="large"
              sx={{ borderRadius: 1.5, mr: 1 }}
              onClick={() => setEnabledVideo(!isEnabledVideo)}
            >
              <SlackIcon
                icon={isEnabledVideo ? "video-camera" : "stop-video-slashless"}
                fontSize="large"
              />

              {!isEnabledVideo && (
                <Box position="absolute" color={color.DANGER}>
                  <SlackIcon icon="stop-video-slashonly" fontSize="large" />
                </Box>
              )}
            </IconButton>

            {/* toggle microphone */}
            <IconButton
              className="bg-gray"
              size="large"
              sx={{ borderRadius: 1, mr: 1 }}
              onClick={() => setEnabledAudio(!isEnabledAudio)}
            >
              <SlackIcon
                icon={isEnabledAudio ? "microphone" : "microphone-slashless"}
                fontSize="large"
              />
              {!isEnabledAudio && (
                <Box position="absolute" color={color.DANGER}>
                  <SlackIcon icon="microphone-slashonly" fontSize="large" />
                </Box>
              )}
            </IconButton>

            {/* blur background screen */}
            <IconButton className="bg-gray" size="large" sx={{ borderRadius: 1, mr: 1 }}>
              <SlackIcon icon="sparkles" fontSize="large" />
            </IconButton>

            {/* setting devices */}
            <IconButton
              ref={settingButtonRef}
              className="bg-gray"
              size="large"
              sx={{ borderRadius: 1, mr: 1 }}
              onClick={() => setShowSettingMenu(true)}
            >
              <SlackIcon icon="cog-o" fontSize="large" />
            </IconButton>
          </Box>
        </Box>

        {/* setting Menu */}
        <RecordSettingMenu
          open={isShowSettingMenu}
          anchorEl={settingButtonRef.current}
          devices={keepRef.current.devices || []}
          selectedAudioId={selectedAudioId}
          selectedVideoId={selectedVideoId}
          onSelectAudioDevice={(id) => setSelectedAudioId(id)}
          onSelectVideoDevice={(id) => setSelectedVideoId(id)}
          onClose={() => setShowSettingMenu(false)}
        />
      </ModalBody>

      <ModalFooter isBorder>
        <Box display="flex" justifyContent="space-between">
          <Button color="error" size="medium" sx={{ ml: -1.25 }} onClick={() => {}}>
            <SlackIcon icon="cloud-upload" />
            <Typography fontWeight={700} color={color.HIGH} sx={{ ml: 1 }}>
              Upload video
            </Typography>
          </Button>

          <Box>
            <Button color="error" size="medium" onClick={() => setShareScreen(!isShareScreen)}>
              {isShareScreen ? (
                <SlackIcon icon="stop-screen-sharing-alt" />
              ) : (
                <SlackIcon icon="share-screen" />
              )}
              <Typography fontWeight={700} color={color.HIGH} sx={{ ml: 1 }}>
                {isShareScreen ? "Stop sharing" : "Share screen"}
              </Typography>
            </Button>
            <Button
              variant="contained"
              color="error"
              size="large"
              sx={{ ml: 2 }}
              disabled={!keepRef.current.mediaRecoder}
              onClick={isRecording ? handleDoneRecord : handleStartRecord}
            >
              {isRecording ? "Stop" : "Record"}
            </Button>
          </Box>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default RecordModal;
