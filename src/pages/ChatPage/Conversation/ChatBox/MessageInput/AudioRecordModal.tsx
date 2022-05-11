import { FC, useContext, useEffect, useRef, useState } from "react";
import MicrophonePlugin from "wavesurfer.js/src/plugin/microphone";
import { v4 as uuid } from "uuid";

// components
import { Modal, ModalProps } from "components/Modal";
import AudioWaveSurfer from "components/AudioWaveSurfer";
import { Box, IconButton } from "@mui/material";

// utils
import { color } from "utils/constants";
import SlackIcon from "components/SlackIcon";
import { buildProgressTime } from "utils/waveSurver";

// sounds
import popSound from "assets/media/effect/pop_sound.mp3";

// context
import ChatBoxContext from "./InputContext";

export interface AudioRecordModalProps extends ModalProps {}

const AudioRecordModal: FC<AudioRecordModalProps> = ({ isOpen, onClose, ...props }) => {
  const { setInputFile } = useContext(ChatBoxContext);

  const keepRef = useRef({
    isSave: false,
    duration: 0,
    intervalIds: [] as NodeJS.Timer[],
    peaks: [] as number[],
  });

  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer>();
  const [time, setTime] = useState("0:00");

  const handleStopMicrophone = () => {
    keepRef.current.intervalIds.forEach((id) => clearInterval(id));
    keepRef.current.intervalIds = [];

    if (waveSurfer?.microphone?.active) {
      waveSurfer?.microphone.stop();
      waveSurfer?.microphone.stopDevice();
      waveSurfer?.microphone.destroy();
      setWaveSurfer(undefined);
    }
  };

  const handleClose = () => {
    handleStopMicrophone();
    onClose();
  };

  const handleSave = () => {
    const backend: any = waveSurfer?.backend;
    keepRef.current.isSave = true;
    keepRef.current.peaks = backend?.splitPeaks[0] || [];
    handleClose();
  };

  // setup and start microphone after modal shown
  useEffect(() => {
    if (!waveSurfer || !isOpen) return;
    // register microphone plugin
    waveSurfer.registerPlugins([MicrophonePlugin.create({})]);

    waveSurfer.microphone.on("deviceReady", (stream) => {
      const audioChunks: Blob[] = [];
      const mediaRecorder = new MediaRecorder(stream);

      // data recorder change listener
      mediaRecorder.ondataavailable = ({ data }) => audioChunks.push(data);

      // recorder start listener
      mediaRecorder.onstart = () => {
        // reset keep duration before count time
        keepRef.current.duration = 0;

        // count time each 100ms
        const intervalId = setInterval(() => {
          setTime(buildProgressTime(Math.ceil(++keepRef.current.duration / 10)));
        }, 100);

        // keep intervalId for clearing
        keepRef.current.intervalIds.push(intervalId);
      };

      // recorder stop listener
      mediaRecorder.onstop = (event) => {
        const blob = new Blob(audioChunks);
        // if saveButton clicked, isSave will be true
        if (keepRef.current.isSave) {
          const id = `F-${uuid()}`;
          setInputFile({
            id,
            url: URL.createObjectURL(blob),
            created: Date.now(),
            fileType: "webm",
            type: "audio",
            size: blob.size,
            wavePeaks: keepRef.current.peaks,
            mineType: "audio/webm",
            duration: Math.ceil(keepRef.current.duration / 10),
          });
        }
      };

      // play pop sound
      new Audio(popSound).play().then(() => {
        waveSurfer.setWaveColor(color.HIGHLIGHT);
        mediaRecorder.start();
      });
    });

    // reset isSave state before start microphone
    keepRef.current.isSave = false;
    waveSurfer.microphone.start();
  }, [waveSurfer, isOpen, setInputFile]);

  // keep isOpen prop
  useEffect(() => {
    if (isOpen) setTime("0:00");
  }, [waveSurfer, isOpen]);

  return (
    <Modal
      autoWidth
      autoHeight
      isCloseBtnCorner
      shouldCloseOnEsc={false}
      shouldCloseOnOverlayClick={false}
      isOpen={isOpen}
      anchorOrigin={{ horizontal: "center", vertical: "top" }}
      transformOrigin={{ horizontal: "center", vertical: "bottom" }}
      transformExtra={{ vertical: 8 }}
      style={{ content: { borderRadius: 4 } }}
      onClose={handleClose}
      {...props}
    >
      <Box position="relative" p={1.5}>
        <AudioWaveSurfer height={34} width={143} progressTime={time} onCreated={setWaveSurfer} />
        <Box position="absolute" bottom={-32} left="50%" sx={{ transform: "translateX(-50%)" }}>
          <IconButton color="info" sx={{ borderRadius: 1 }} onClick={handleSave}>
            <SlackIcon icon="check-large-bold" fontSize="large" />
          </IconButton>
        </Box>
      </Box>
    </Modal>
  );
};

export default AudioRecordModal;
