import { FC, useState } from "react";

// components
import { Box, CircularProgress, IconButton } from "@mui/material";
import SlackIcon from "components/SlackIcon";

// utils
import { color, rgba } from "utils/constants";
import AudioWaveSurfer from "components/AudioWaveSurfer";

// types
import { MessageFileType } from "store/slices/_types";

export interface MediaFileProps {
  file: MessageFileType;
}

const MediaFile: FC<MediaFileProps> = ({ file }) => {
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer>();
  const [loadPercent, setLoadPercent] = useState(0);
  const [isPlaying, setPlaying] = useState(false);

  const handlePlay = () => {
    if (!waveSurfer || !file) return;
    // audio is loading
    if (isPlaying && loadPercent < 100) return;

    // audio have not loaded yet
    if (loadPercent === 0) waveSurfer.load(file.url, file.wavePeaks);

    if (isPlaying) {
      setPlaying(false);
      waveSurfer.pause();
    } else {
      setPlaying(true);
      waveSurfer.play();
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      p={1.5}
      mb={1}
      mr={1}
      border="1px solid"
      borderColor={rgba(color.PRIMARY, 0.1)}
      borderRadius={2.5}
      overflow="hidden"
    >
      <Box position="relative">
        {isPlaying && loadPercent < 100 && (
          <Box position="absolute" top={-3} left={-3}>
            <CircularProgress variant="determinate" value={loadPercent} />
          </Box>
        )}
        <IconButton
          color="info"
          size="large"
          onClick={handlePlay}
          disabled={isPlaying && loadPercent < 100}
        >
          <SlackIcon icon={isPlaying ? "pause-bold" : "play-filled"} />
        </IconButton>
      </Box>
      <Box ml={2}>
        <AudioWaveSurfer
          height={34}
          width={200}
          peaks={file.wavePeaks}
          onCreated={setWaveSurfer}
          onLoading={setLoadPercent}
        />
      </Box>
      <Box ml={2}>
        <IconButton sx={{ borderRadius: 0.5 }} disabled>
          <SlackIcon icon="list" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default MediaFile;
