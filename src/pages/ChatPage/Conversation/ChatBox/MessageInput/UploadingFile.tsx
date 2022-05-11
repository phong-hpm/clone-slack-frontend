import { FC, useEffect, useState, useContext } from "react";

// components
import { Box, IconButton } from "@mui/material";
import AudioWaveSurfer from "components/AudioWaveSurfer";
import SlackIcon from "components/SlackIcon";

// context
import ChatBoxContext from "./InputContext";

// utils
import { color, rgba } from "utils/constants";

// types
import { MessageFileType } from "store/slices/_types";

export interface UploadingFileProps {
  inputFile: MessageFileType;
}

const UploadingFile: FC<UploadingFileProps> = ({ inputFile }) => {
  const { removeInputFile } = useContext(ChatBoxContext);

  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer>();
  const [isPlaying, setPlaying] = useState(false);

  const handleRemove = () => {
    removeInputFile(inputFile.id);
  };

  const handlePlay = () => {
    if (isPlaying) {
      setPlaying(false);
      waveSurfer?.pause();
    } else {
      setPlaying(true);
      waveSurfer?.play();
    }
  };

  useEffect(() => {
    if (!waveSurfer) return;
    waveSurfer.load(inputFile.url);
  }, [inputFile.url, waveSurfer]);

  return (
    <Box
      display="flex"
      alignItems="center"
      p={1.5}
      mb={1}
      mr={1}
      borderRadius={2.5}
      border="1px solid"
      borderColor={rgba(color.PRIMARY, 0.1)}
      bgcolor={color.PRIMARY_BACKGROUND}
    >
      <Box>
        <IconButton color="info" size="large" onClick={handlePlay}>
          <SlackIcon icon={isPlaying ? "pause-bold" : "play-filled"} />
        </IconButton>
      </Box>
      <Box position="relative" ml={2}>
        <AudioWaveSurfer
          height={34}
          width={143}
          duration={inputFile.duration}
          onCreated={setWaveSurfer}
          onFinish={() => setPlaying(false)}
        />

        <Box position="absolute" top={-20} right={-20}>
          <IconButton color="secondary" size="medium" onClick={handleRemove}>
            <SlackIcon fontSize="small" icon="close" />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default UploadingFile;
