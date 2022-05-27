import { FC, useCallback, useEffect, useRef, useState } from "react";

// components
import { Modal, ModalBody, ModalProps } from "components/Modal";
import { Box, Typography } from "@mui/material";
import RecordModalHeader from "./RecordModalHeader";
import RecordModalFooter from "./RecordModalFooter";
import RecordVideoToolbar from "./RecordVideoToolbar";
import RecorderManager from "./RecorderManager";

// utils
import { color, resolutions, rgba } from "utils/constants";

// types
import { StatusType } from "./_types";

// sounds
import popSound from "assets/media/pop_sound.mp3";

export interface RecordModalProps extends ModalProps {
  onNext: (url: string, duration: number) => void;
}

const RecordModal: FC<RecordModalProps> = ({ isOpen, onNext, ...props }) => {
  const mergedRef = useRef<HTMLVideoElement>(null);
  const cameraRef = useRef<HTMLVideoElement>(null);
  const screenRef = useRef<HTMLVideoElement>(null);

  const keepRef = useRef({
    canvasEl: null as HTMLCanvasElement | null,
    canvasCtx: null as CanvasRenderingContext2D | null,
    timeoutId: null as NodeJS.Timer | null,
    recorderManager: null as RecorderManager | null,
  });

  const [, setForUpdate] = useState(0);
  const [status, setStatus] = useState<StatusType>("inactive");

  const [isPlaying, setPlaying] = useState(false);
  const [isShareScreen, setShareScreen] = useState(false);
  const [duration, setDuration] = useState(0);
  const [countDown, setCountDown] = useState(0);
  const [selectedDevice, setSelectedDevice] = useState({ audio: "", video: "" });
  const [enabledDevice, setEnabledDevice] = useState({ audio: true, video: true });

  const handleDone = useCallback(() => {
    const { recorderManager } = keepRef.current;
    if (!recorderManager) return;
    const blob = new Blob(recorderManager.chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);

    recorderManager?.stop();

    onNext(url, Math.floor(recorderManager.duration / 1000));
  }, [onNext]);

  const setupStream = useCallback(async () => {
    const { recorderManager } = keepRef.current;
    if (!recorderManager) return;

    const audio = { deviceId: selectedDevice.audio };
    const video = { ...resolutions[0], deviceId: selectedDevice.video };

    try {
      if (!isShareScreen) {
        // wait for catching error if it has
        await recorderManager.createCameraStream(audio, video);
        recorderManager.stopScreen();
      } else {
        // wait for catching error if it has
        await recorderManager.createScreenStream(audio, video);
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
      keepRef.current.recorderManager?.stop();
      setShareScreen(false);
      setDuration(0);
    }
  }, [status]);

  // status === "active" -> get streams, recoder
  useEffect(() => {
    if (status === "active") setupStream();
  }, [status, setupStream]);

  // status === "counting" -> start counting
  useEffect(() => {
    if (status === "counting") {
      const startCountDown = (count: number) => {
        setCountDown(count);
        if (count === 0) return setStatus("recording");
        keepRef.current.timeoutId = setTimeout(() => startCountDown(count - 1), 1000);
      };

      startCountDown(3);
    } else {
      setCountDown(0);
      clearTimeout(keepRef.current.timeoutId!);
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
    if (duration >= 300) handleDone();
  }, [duration, handleDone]);

  const isDisabledRecord =
    !keepRef.current.recorderManager?.recorder ||
    (status === "recording" && !keepRef.current.recorderManager?.chunks.length);

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
            <video ref={screenRef} autoPlay />
            <Box position="absolute" top="0" bottom="0" left="0" right="0">
              <video ref={mergedRef} autoPlay />
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
            <video ref={cameraRef} autoPlay style={{ transform: "rotateY(180deg)" }} />
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
              bgcolor={rgba(color.PRIMARY_BACKGROUND, 0.8)}
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
        isDisabledRecord={isDisabledRecord}
        isShareScreen={isShareScreen}
        isPlaying={isPlaying}
        duration={duration}
        status={status}
        setStatus={setStatus}
        togglePlaying={() => setPlaying(!isPlaying)}
        toggleShareScreen={() => setShareScreen(!isShareScreen)}
        onDone={handleDone}
      />
    </Modal>
  );
};

export default RecordModal;
