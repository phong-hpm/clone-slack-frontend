import { FC, useCallback, useEffect, useRef, useState } from "react";

// components
import { Modal, ModalHeader, ModalBody, ModalFooter, ModalProps } from "components/Modal";
import { Box, Button, Typography, IconButton, Slider } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import RecordSettingMenu from "./RecordSettingMenu";

// utils
import { color, resolutions, deviceKind, rgba } from "utils/constants";
import { createRecoder } from "utils/videoRecorder";

// types
import { MediaDeviceInfoType } from "../../_types";
import { ResolutionType } from "utils/_types";
import { MessageFileType } from "store/slices/_types";
import Video from "components/Video";

// sounds
import popSound from "assets/media/effect/pop_sound.mp3";
import { buildProgressTime } from "utils/waveSurver";

export interface RecordModalProps extends ModalProps {
  onNext: (file: MessageFileType) => void;
}

const RecordModal: FC<RecordModalProps> = ({ isOpen, onClose, onNext, ...props }) => {
  const settingButtonRef = useRef<HTMLButtonElement>(null);
  const keepRef = useRef<{
    intervalIds: NodeJS.Timer[];
    file?: MessageFileType;
    videoWidth?: number;
    devices?: MediaDeviceInfoType[];
    resolution: ResolutionType;
  }>({ resolution: resolutions[0], intervalIds: [] as NodeJS.Timer[] });

  // storing stream in state to trigger some useEffect
  const [mediaRecoder, setMediaRecoder] = useState<MediaRecorder | undefined>();
  const [cameraStream, setCameraStream] = useState<MediaStream | undefined>();
  const [shareScreenStream, setShareScreenStream] = useState<MediaStream | undefined>();
  const [cameraElement, setCameraElement] = useState<HTMLVideoElement | null>(null);
  const [shareScreenElement, setShareScreenElement] = useState<HTMLVideoElement | null>(null);
  const [selectedDevice, setSelectedDevice] = useState({ audio: "", video: "" });

  const [isShareScreen, setShareScreen] = useState(false);
  const [isEnabledAudio, setEnabledAudio] = useState(true);
  const [isEnabledVideo, setEnabledVideo] = useState(true);
  const [isShowSettingMenu, setShowSettingMenu] = useState(false);
  const [duration, setDuration] = useState(0);
  const [countDown, setCountDown] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [status, setStatus] = useState<"ready" | "counting" | "recording">("ready");

  const handleStopRecord = useCallback(() => {
    // stop camera stream
    cameraStream?.getTracks().forEach((track) => track.stop());
    // stop sharescreen stream
    shareScreenStream?.getTracks().forEach((track) => track.stop());
    // stop camera recoder
    mediaRecoder?.state === "recording" && mediaRecoder.stop();
  }, [cameraStream, shareScreenStream, mediaRecoder]);

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

  const startCountDown = () => {
    new Audio(popSound).play();
    setStatus("counting");
    setCountDown(3);

    const intervalId = setInterval(() => {
      new Audio(popSound).play();

      setCountDown((oldState) => {
        if (oldState > 1) return oldState - 1;
        handleStartRecord();
        return 0;
      });
    }, 1000);

    keepRef.current.intervalIds.push(intervalId);
  };

  const stopCountDown = () => {
    setCountDown(0);
    keepRef.current.intervalIds.forEach((id) => clearInterval(id));
    keepRef.current.intervalIds = [];
  };

  const handleStartRecord = () => {
    stopCountDown();
    if (mediaRecoder && mediaRecoder.state !== "recording") {
      mediaRecoder.start();
      setStatus("recording");
      setPlaying(true);
    }
  };

  // reset sharescreen state after close modal
  useEffect(() => {
    if (!isOpen) {
      keepRef.current.intervalIds.forEach((id) => clearInterval(id));
      keepRef.current.intervalIds = [];
      setShareScreen(false);
      setStatus("ready");
    }
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
      setSelectedDevice({ audio: audioDevices[0].deviceId, video: videoDevices[0].deviceId });
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
  useEffect(() => setShowSettingMenu(false), [selectedDevice]);

  // get stream when modal open
  useEffect(() => {
    if (!isOpen) return;

    (async () => {
      const audio = { deviceId: selectedDevice.audio };
      const video = { ...keepRef.current.resolution, deviceId: selectedDevice.video };
      let stream: MediaStream;

      if (!isShareScreen) {
        stream = await navigator.mediaDevices.getUserMedia({ audio, video });
        setCameraStream(stream);
      } else {
        stream = await navigator.mediaDevices.getDisplayMedia({ audio, video });
        setShareScreenStream(stream);
      }

      const callback = (file: MessageFileType) => (keepRef.current.file = file);
      const recoder = createRecoder(stream, setDuration, callback);
      setMediaRecoder(recoder);
    })();
  }, [isOpen, isShareScreen, selectedDevice]);

  // assign stream to camera element
  useEffect(() => {
    if (!cameraElement || !cameraStream) return;
    cameraElement.volume = 0;
    cameraElement.srcObject = cameraStream;
  }, [cameraElement, cameraStream]);

  // assign stream to sharescreen element
  useEffect(() => {
    if (!shareScreenElement || !shareScreenStream) return;
    shareScreenElement.volume = 0;
    shareScreenElement.srcObject = shareScreenStream;
  }, [shareScreenElement, shareScreenStream]);

  // limit record times is 5 minutes
  useEffect(() => {
    if (duration >= 300) handleStopRecord();
  }, [duration, handleStopRecord]);

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
      <ModalHeader>
        {status === "ready" && (
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography variant="h3">Record video clip</Typography>
            <Box>
              <IconButton size="large" sx={{ borderRadius: 1 }}>
                <SlackIcon icon="question-circle" fontSize="large" />
              </IconButton>
            </Box>
          </Box>
        )}
      </ModalHeader>

      {/* video */}
      <ModalBody py={6}>
        <Box position="relative" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Video
            ref={setShareScreenElement}
            autoPlay
            // sharescreen video can not apply any fixed resolution
            // size of sharecreen video have to fit with user's monitor
            // ratio={keepRef.current.resolution.height / keepRef.current.resolution.width}
            style={{ display: isShareScreen ? "block" : "none", background: rgba(color.DARK, 0.2) }}
          />
          <Box
            position={isShareScreen ? "absolute" : "relative"}
            right={isShareScreen ? 20 : 0}
            bottom={isShareScreen ? 20 : 0}
            width={isShareScreen ? 100 : "100%"}
            display={isShareScreen && !isEnabledVideo ? "none" : "block"}
          >
            <Video
              ref={setCameraElement}
              autoPlay
              ratio={keepRef.current.resolution.height / keepRef.current.resolution.width}
              style={{ transform: "rotateY(180deg)", background: rgba(color.DARK, 0.2) }}
            />
          </Box>

          {/* countdown */}
          {!!countDown && (
            <Box
              position="absolute"
              top={0}
              bottom={0}
              left={0}
              right={0}
              display="flex"
              justifyContent="center"
              alignItems="center"
              bgcolor="rgba(29, 28, 29, 0.7)"
            >
              <Typography variant="h3">Recording begins in {countDown}...</Typography>
            </Box>
          )}

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
          selectedAudioId={selectedDevice.audio}
          selectedVideoId={selectedDevice.video}
          onSelectAudioDevice={(id) => setSelectedDevice((state) => ({ ...state, audio: id }))}
          onSelectVideoDevice={(id) => setSelectedDevice((state) => ({ ...state, video: id }))}
          onClose={() => setShowSettingMenu(false)}
        />
      </ModalBody>

      <ModalFooter>
        <Slider
          value={duration}
          min={0}
          max={300}
          componentsProps={{ thumb: { style: { display: "none" } } }}
        />

        <Box display="flex" justifyContent="space-between">
          {status === "recording" && (
            <Box>
              <Typography lineHeight={2.5} sx={{ ml: 1 }}>
                {`${buildProgressTime(duration)} / ${buildProgressTime(300)}`}
              </Typography>
            </Box>
          )}
          <Box>
            {/* upload video button */}
            {status === "ready" && (
              <Button color="error" size="medium" sx={{ ml: -1.25 }} onClick={() => {}}>
                <SlackIcon icon="cloud-upload" />
                <Typography fontWeight={700} color={color.HIGH} sx={{ ml: 1 }}>
                  Upload video
                </Typography>
              </Button>
            )}
          </Box>

          <Box>
            {/* sharescreen button */}
            {status !== "counting" && (
              <Button color="error" size="medium" onClick={() => setShareScreen(!isShareScreen)}>
                <SlackIcon icon={isShareScreen ? "stop-screen-sharing-alt" : "share-screen"} />
                <Typography fontWeight={700} color={color.HIGH} sx={{ ml: 1 }}>
                  {isShareScreen ? "Stop sharing" : "Share screen"}
                </Typography>
              </Button>
            )}

            {/* pause/resume button */}
            {status === "recording" && (
              <Button
                color="error"
                size="medium"
                onClick={() => {
                  if (isPlaying) {
                    setPlaying(false);
                    mediaRecoder?.pause();
                  } else {
                    setPlaying(true);
                    mediaRecoder?.resume();
                  }
                }}
              >
                <SlackIcon icon={isShareScreen ? "pause" : "play"} />
                <Typography fontWeight={700} color={color.HIGH} sx={{ ml: 1 }}>
                  {isPlaying ? "Pause" : "Resume"}
                </Typography>
              </Button>
            )}

            {/* record button */}
            <Button
              variant="contained"
              color="error"
              size="large"
              sx={{ ml: 2 }}
              disabled={!mediaRecoder}
              onClick={() => {
                if (status === "ready") {
                  startCountDown();
                } else if (status === "counting") {
                  stopCountDown();
                  setStatus("ready");
                } else {
                  handleDoneRecord();
                }
              }}
            >
              {status === "ready" ? "Record" : "Stop"}
            </Button>
          </Box>
        </Box>
      </ModalFooter>
    </Modal>
  );
};

export default RecordModal;
