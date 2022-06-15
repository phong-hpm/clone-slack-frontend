import { FC, useCallback, useContext, useEffect, useRef, useState } from "react";
import { v4 as uuid } from "uuid";

// components
import WaveSurfer from "wavesurfer.js";
import MicrophonePlugin from "wavesurfer.js/src/plugin/microphone";
import { Modal, ModalProps } from "components/Modal";
import AudioWaveSurfer from "components/AudioWaveSurfer";
import { Box, IconButton } from "@mui/material";

// utils
import { color } from "utils/constants";
import SlackIcon from "components/SlackIcon";
import { buildProgressTime, buildPeaks, createWaveSurfer } from "utils/waveSurver";

// sounds
import popSound from "assets/media/pop_sound.mp3";

// context
import InputContext from "../../InputContext";

export interface RecordAudioModalProps extends ModalProps {}

const RecordAudioModal: FC<RecordAudioModalProps> = ({ isOpen, onClose, ...props }) => {
  const { setInputFile } = useContext(InputContext);

  const keepRef = useRef({
    isSave: false,
    duration: 0,
    timeoutId: null as NodeJS.Timer | null,
    peaks: [] as number[],
  });

  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer>();
  const [time, setTime] = useState("0:00");

  const handleStopMicrophone = () => {
    clearTimeout(keepRef.current.timeoutId!);

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
    keepRef.current.isSave = true;
    handleClose();
  };

  const updateInputFile = useCallback(
    (blob: Blob) => {
      // create new waveSurfer instace
      const ws = createWaveSurfer({});
      // load blob:url
      ws.load(URL.createObjectURL(blob));
      // listener ready
      ws.once("ready", () => {
        const id = `F-${uuid()}`;
        // after load blob:url, store peaks to context
        const wavePeaks = ws.backend?.getPeaks(200, 0, 200) as number[];

        setInputFile({
          id,
          url: URL.createObjectURL(blob),
          createdTime: Date.now(),
          type: "audio",
          wavePeaks: buildPeaks(wavePeaks),
          mineType: "audio/webm",
          duration: Math.ceil(keepRef.current.duration / 10),
        });

        // destrpoy after done
        ws.destroy();
      });
    },
    [setInputFile]
  );

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
        const countDuration = () => {
          setTime(buildProgressTime(Math.ceil(++keepRef.current.duration / 10)));
          keepRef.current.timeoutId = setTimeout(() => countDuration(), 100);
        };
        countDuration();
      };

      // recorder stop listener
      mediaRecorder.onstop = () => {
        keepRef.current.isSave && updateInputFile(new Blob(audioChunks, { type: "audio/webm" }));
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
  }, [waveSurfer, isOpen, updateInputFile]);

  // keep isOpen prop
  useEffect(() => {
    isOpen && setTime("0:00");
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

export default RecordAudioModal;
