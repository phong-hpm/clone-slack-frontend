import { FC, useCallback, useState } from "react";

// utils
import { color, rgba } from "utils/constants";

// components
import {
  Box,
  CircularProgress,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";
import SlackIcon from "components/SlackIcon";
import AudioWaveSurfer, { AudioWaveSurferProps } from "components/AudioWaveSurfer";

// types
import { MessageFileType } from "store/slices/_types";

const startLoadPercent = 1;

export interface ReviewAudioCardProps extends AudioWaveSurferProps {
  isRemove?: boolean;
  isTranscript?: boolean;
  isSpeedSelection?: boolean;
  isControls?: boolean;
  onRemove?: () => void;
  file: MessageFileType;
}

const ReviewAudioCard: FC<ReviewAudioCardProps> = ({
  isRemove,
  isTranscript,
  isSpeedSelection,
  isControls,
  file,
  onRemove,
  onCreated,
  ...props
}) => {
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer>();
  const [loadPercent, setLoadPercent] = useState(startLoadPercent);
  const [isHovering, setHovering] = useState(false);
  const [isPlaying, setPlaying] = useState(false);
  const [speed, setSpeed] = useState("1");

  const handleCreated = useCallback(
    (ws: WaveSurfer) => {
      setWaveSurfer(ws);
      onCreated && onCreated(ws);
    },
    [onCreated]
  );

  const handlePlay = () => {
    if (!waveSurfer || !file.url) return;
    // audio is loading
    if (isPlaying && loadPercent < 100) return;

    // audio have not loaded yet
    if (loadPercent === startLoadPercent) waveSurfer.load(file.url, file.wavePeaks);

    if (isPlaying) {
      setPlaying(false);
      waveSurfer.pause();
    } else {
      setPlaying(true);
      waveSurfer.play();
    }
  };

  const handleChangeSpeed = (event: SelectChangeEvent) => {
    setSpeed(event.target.value);
    waveSurfer?.setPlaybackRate(Number(event.target.value));
  };

  return (
    <Box
      position="relative"
      display="flex"
      alignItems="center"
      p={1.5}
      mt={1}
      mr={1}
      borderRadius={2.5}
      border="1px solid"
      borderColor={rgba(color.PRIMARY, 0.1)}
      bgcolor={color.PRIMARY_BACKGROUND}
      onMouseOver={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
    >
      {/* start button */}
      <Box position="relative">
        {isPlaying && loadPercent < 100 && (
          <Box position="absolute" top={-3} left={-3}>
            <CircularProgress variant="determinate" value={loadPercent || startLoadPercent} />
          </Box>
        )}

        <IconButton
          color="info"
          size="large"
          onClick={handlePlay}
          disabled={(isPlaying && loadPercent < 100) || !file.url}
        >
          <SlackIcon icon={isPlaying ? "pause-bold" : "play-filled"} />
        </IconButton>
      </Box>

      {/* WaveSurfer */}
      <Box ml={2}>
        <AudioWaveSurfer
          peaks={file.wavePeaks}
          onCreated={handleCreated}
          onLoading={setLoadPercent}
          duration={file.duration || 0}
          onFinish={() => setPlaying(false)}
          {...props}
        />
      </Box>

      {/* transcript button */}
      {isTranscript && (
        <Box ml={1}>
          <IconButton sx={{ borderRadius: 1 }} size="large" disabled>
            <SlackIcon icon="list" />
          </IconButton>
        </Box>
      )}

      {/* speed selection */}
      {isSpeedSelection && (
        <Box ml={0.5}>
          <Select
            variant="standard"
            size="small"
            value={speed}
            IconComponent={() => <></>}
            onChange={handleChangeSpeed}
          >
            <MenuItem disabled>
              <Typography color={color.HIGH}>Playback Speed</Typography>
            </MenuItem>
            <MenuItem value="0.25">0.25x</MenuItem>
            <MenuItem value="0.5">0.5x</MenuItem>
            <MenuItem value="0.75">0.75x</MenuItem>
            <MenuItem value="1">1x</MenuItem>
            <MenuItem value="1.25">1.25x</MenuItem>
            <MenuItem value="1.5">1.5x</MenuItem>
            <MenuItem value="2">2x</MenuItem>
          </Select>
        </Box>
      )}

      {/* control dropdown */}
      {isControls && (
        <Box ml={0.5}>
          <IconButton sx={{ borderRadius: 1 }} size="large">
            <SlackIcon icon="ellipsis-vertical-filled" />
          </IconButton>
        </Box>
      )}

      {/* remove button */}
      {isRemove && isHovering && (
        <Box position="absolute" top={-8} right={-8}>
          <IconButton color="secondary" size="medium" onClick={onRemove}>
            <SlackIcon fontSize="small" icon="close" />
          </IconButton>
        </Box>
      )}
    </Box>
  );
};

export default ReviewAudioCard;
