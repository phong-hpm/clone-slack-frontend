import { FC, useCallback, useEffect, useRef, useState } from "react";

// components
import { Modal, ModalBody, ModalProps } from "components/Modal";
import { Box, Typography } from "@mui/material";
import Video from "components/Video";
import RecordModalHeader from "./RecordModalHeader";
import RecordModalFooter from "./RecordModalFooter";
import RecordVideoToolbar from "./RecordVideoToolbar";
import RecorderManager from "./RecorderManager";

// utils
import { color, resolutions, rgba } from "utils/constants";

// types
import { StatusType } from "./_types";
import { MediaDeviceInfoType } from "pages/ChatPage/Conversation/ChatBox/MessageInput/_types";

// sounds
import popSound from "assets/media/effect/pop_sound.mp3";

export interface RecordModalProps extends ModalProps {
  onNext: (chunks: Blob[], duration: number) => void;
}

const RecordModal: FC<RecordModalProps> = ({ isOpen, onNext, ...props }) => {
  const cameraRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);
  const mergedRef = useRef<HTMLVideoElement>(null);

  const keepRef = useRef({
    canvasEl: null as HTMLCanvasElement | null,
    canvasCtx: null as CanvasRenderingContext2D | null,
    intervalIds: [] as NodeJS.Timer[],
    devices: [] as MediaDeviceInfoType[],
    chunks: [] as Blob[],
    recorderManager: null as RecorderManager | null,
  });

  const [selectedDevice, setSelectedDevice] = useState({ audio: "", video: "" });

  const [isShareScreen, setShareScreen] = useState(false);
  const [enabledDevice, setEnabledDevice] = useState({ audio: true, video: true });
  const [duration, setDuration] = useState(0);
  const [countDown, setCountDown] = useState(0);
  const [isPlaying, setPlaying] = useState(false);
  const [status, setStatus] = useState<StatusType>("inactive");
  const [, setForUpdate] = useState(0);

  const setupStream = useCallback(async () => {
    const { recorderManager } = keepRef.current;
    if (!recorderManager) return;

    const audio = { deviceId: selectedDevice.audio };
    const video = { ...resolutions[0], deviceId: selectedDevice.video };

    try {
      if (!isShareScreen) {
        recorderManager.createCameraStream(audio, video);
        recorderManager.stopScreen();
      } else {
        recorderManager.createScreenStream(audio, video);
      }
    } catch {
      // if user cancel sharescreen or video, reset [isShareScreen] state
      setShareScreen(false);
    }
  }, [isShareScreen, selectedDevice]);

  // set status when isOpen change
  useEffect(() => setStatus(isOpen ? "active" : "inactive"), [isOpen]);

  // status === "inactive" -> reset all states
  useEffect(() => {
    if (status === "inactive") {
      keepRef.current.chunks = [];
      keepRef.current.recorderManager?.stop();
      setShareScreen(false);
    }
  }, [status]);

  // status === "active" -> get streams, recoder
  useEffect(() => {
    if (status === "active") setupStream();
  }, [status, setupStream]);

  // status === "counting" -> start counting
  useEffect(() => {
    if (status === "counting") {
      setCountDown(3);

      const intervalId = setInterval(() => {
        setCountDown((oldState) => {
          if (oldState === 1) setStatus("recording");
          return oldState - 1;
        });
      }, 1000);

      keepRef.current.intervalIds.push(intervalId);
    } else {
      setCountDown(0);
      keepRef.current.intervalIds.forEach((id) => clearInterval(id));
      keepRef.current.intervalIds = [];
    }
  }, [status]);

  // play pop sound when [countDown] changed
  useEffect(() => {
    if (countDown > 0) new Audio(popSound).play();
  }, [countDown]);

  // status === "recording" -> start recording
  useEffect(() => {
    const { recorderManager } = keepRef.current;
    if (status === "recording" && recorderManager?.recorder?.state !== "recording") {
      recorderManager?.start();
      setPlaying(true);
    }
  }, [status]);

  // trigger pause/resume when [isPlaying] state was changed
  // [mediaRecorder] is controlled by [isPlaying]
  useEffect(() => {
    const { recorderManager } = keepRef.current;
    if (!recorderManager || recorderManager.recorder?.state === "inactive") return;
    if (isPlaying) recorderManager.recorder?.resume();
    else recorderManager.recorder?.pause();
  }, [isPlaying]);

  // stop sharescreen stream when [isShareScreen] state be false
  useEffect(() => {
    const { recorderManager } = keepRef.current;
    if (!recorderManager || isShareScreen) return;
    recorderManager.stopScreen();
  }, [isShareScreen]);

  // toggle audio/video stream
  useEffect(() => {
    const { recorderManager } = keepRef.current;
    if (!recorderManager) return;
    // audio
    recorderManager.setEnableAudio(enabledDevice.audio);
    // video
    recorderManager.setEnableVideoCamera(enabledDevice.video);
  }, [enabledDevice]);

  // init [recorderManager]
  useEffect(() => {
    keepRef.current.recorderManager = new RecorderManager(
      cameraRef,
      screenRef,
      mergedRef,
      setForUpdate,
      setDuration
    );
  }, []);

  // limit record times is 5 minutes
  useEffect(() => {
    if (duration >= 300) keepRef.current.recorderManager?.stop();
  }, [duration]);

  return (
    <Modal
      isCloseBtn
      className="modal-record"
      isOpen={isOpen}
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      transformOrigin={{ horizontal: "center", vertical: "bottom" }}
      transformExtra={{ vertical: 8 }}
      {...props}
    >
      <RecordModalHeader status={status} />

      <ModalBody pt={6} pb={4}>
        <Box position="relative" sx={{ borderRadius: 2, overflow: "hidden" }}>
          <Box
            bgcolor={rgba(color.DARK, 0.2)}
            position={isShareScreen ? "relative" : "absolute"}
            sx={{ opacity: isShareScreen ? "1" : "0" }}
          >
            {/*
              sharescreen video can not apply any fixed resolution
              size of sharecreen video have to fit with user's monitor
              ratio={keepRef.current.resolution.height / keepRef.current.resolution.width}
            */}
            <Video ref={screenRef} autoPlay />
            <Box position="absolute" top="0" bottom="0" left="0" right="0">
              <Video id="test" ref={mergedRef} autoPlay />
            </Box>
          </Box>
          <Box
            position={isShareScreen ? "absolute" : "relative"}
            right={isShareScreen ? 20 : 0}
            bottom={isShareScreen ? 20 : 0}
            width={isShareScreen ? 100 : "100%"}
            display={isShareScreen && !enabledDevice.video ? "none" : "block"}
            sx={{ opacity: !isShareScreen ? "1" : "0" }}
          >
            <Video
              ref={cameraRef}
              autoPlay
              ratio={resolutions[0].height / resolutions[0].width}
              style={{ transform: "rotateY(180deg)" }}
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

          {/* toolbar */}
          <RecordVideoToolbar
            isEnabledAudio={enabledDevice.audio}
            isEnabledVideo={enabledDevice.video}
            devices={keepRef.current.recorderManager?.devices}
            selectedDevice={selectedDevice}
            toggleAudio={() => setEnabledDevice((state) => ({ ...state, audio: !state.audio }))}
            toggleVideo={() => setEnabledDevice((state) => ({ ...state, video: !state.video }))}
            onChangeDevice={(device) => setSelectedDevice((state) => ({ ...state, ...device }))}
          />
        </Box>
      </ModalBody>

      <RecordModalFooter
        isDisabledRecord={!keepRef.current.recorderManager?.recorder}
        isShareScreen={isShareScreen}
        isPlaying={isPlaying}
        duration={duration}
        status={status}
        setStatus={setStatus}
        togglePlaying={() => setPlaying(!isPlaying)}
        toggleShareScreen={() => setShareScreen(!isShareScreen)}
        onDone={() => onNext(keepRef.current.recorderManager?.chunks || [], duration)}
      />
    </Modal>
  );
};

export default RecordModal;
