import { forwardRef, useImperativeHandle, useRef, useState } from "react";

// components
import {
  Box,
  Button,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Slider,
  Tooltip,
  Typography,
} from "@mui/material";
import Video, { VideoProps } from "components/Video";
import SlackIcon from "components/SlackIcon";
import { color, rgba } from "utils/constants";
import { buildProgressTime } from "utils/waveSurver";
import TranscriptModal from "./TranscriptModal";
import { TranScriptType } from "./_types";
import { UserType } from "store/slices/_types";

export interface PlayerBaseProps {
  isFullScreen?: boolean;
  src?: string;
  thumbnail?: string;
  created?: number;
  duration?: number;
  scripts?: TranScriptType[];
  ratio?: number;
  userOwner?: UserType;
  videoProps?: VideoProps;
  style?: React.CSSProperties;
  controlStyle?: React.CSSProperties;
  onClickExpand?: () => void;
  onClickTranscript?: () => void;
}

const PlayerBase = forwardRef<HTMLVideoElement, PlayerBaseProps>(
  (
    {
      isFullScreen = false,
      src,
      thumbnail,
      created,
      duration = 1,
      scripts,
      ratio,
      userOwner,
      videoProps,
      style,
      controlStyle,
      onClickExpand,
      onClickTranscript,
    },
    ref
  ) => {
    const bgButton = rgba(color.SECONDARY_BACKGROUND, 0.8);
    const sxIconButton = {
      ml: isFullScreen ? 2 : 0.5,
      borderRadius: 1,
      ":hover": { background: bgButton },
    };

    const videoRef = useRef<HTMLVideoElement>(null);
    const transcriptButtonRef = useRef<HTMLButtonElement>(null);

    const [isPlaying, setPlaying] = useState(false);
    const [isCaption, setCaption] = useState(false);
    const [isHover, setHover] = useState(isFullScreen);
    const [isHoverVolume, setHoverVolume] = useState(false);
    const [isShowTranscriptModal, setShowTranscriptModal] = useState(false);
    const [speed, setSpeed] = useState("1");
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(isFullScreen ? 0 : duration);

    useImperativeHandle(ref, () => videoRef.current!);

    const handleChangeProgressSlider = (value: number) => {
      if (value !== currentTime && videoRef.current) {
        setCurrentTime(value);
        videoRef.current.currentTime = value;
      }
    };

    const handleChangeVolumeSlider = (value: number) => {
      if (value !== volume && videoRef.current) {
        setVolume(value);
        videoRef.current.volume = value / 10;
      }
    };

    const handlePlayPause = () => {
      if (isPlaying) videoRef.current?.pause();
      else videoRef.current?.play();
    };

    const handleChangeSpeed = (event: SelectChangeEvent) => {
      if (!videoRef.current) return;
      setSpeed(event.target.value);
      videoRef.current.playbackRate = Number(event.target.value);
    };

    const renderExpandButton = () => {
      return (
        <Tooltip title="Expand">
          <IconButton
            size="large"
            sx={{ ...sxIconButton, background: bgButton }}
            onClick={onClickExpand}
          >
            <SlackIcon icon="expand" />
          </IconButton>
        </Tooltip>
      );
    };

    const renderMoreButton = () => {
      return (
        <Tooltip title="More actions">
          <IconButton
            size="large"
            sx={{ ...sxIconButton, background: isFullScreen ? "transparent" : bgButton }}
            onClick={() => {}}
          >
            <SlackIcon icon={isFullScreen ? "ellipsis" : "vertical-ellipsis"} />
          </IconButton>
        </Tooltip>
      );
    };

    const renderProgressBar = () => {
      return (
        <Slider
          className="hide-thumb"
          value={currentTime}
          min={0}
          max={duration}
          sx={{ paddingBottom: 1 }}
          onChange={(_, value) => handleChangeProgressSlider(value as number)}
        />
      );
    };

    const renderPlayButton = () => {
      return isFullScreen ? (
        <Tooltip title="Play">
          <IconButton size="large" sx={sxIconButton} onClick={handlePlayPause}>
            <SlackIcon icon={isPlaying ? "pause" : "play"} />
          </IconButton>
        </Tooltip>
      ) : (
        <Button
          sx={{
            p: 0.625,
            background: isHover ? "transparent" : bgButton,
            "&:hover": { background: bgButton },
          }}
          onClick={handlePlayPause}
        >
          <SlackIcon icon={isPlaying ? "pause" : "play-filled"} />
          <Box ml={1} mr={0.5}>
            <Typography fontWeight={700}>{buildProgressTime(currentTime)}</Typography>
          </Box>
        </Button>
      );
    };

    const renderDurationTime = () => {
      return (
        <Box my={1}>
          <Typography fontWeight={700}>
            {buildProgressTime(currentTime)} / {buildProgressTime(duration)}
          </Typography>
        </Box>
      );
    };

    const renderVolumeButton = () => {
      return (
        <Box
          display="flex"
          alignItems="center"
          pr={2}
          onMouseOver={() => setHoverVolume(true)}
          onMouseLeave={() => setHoverVolume(false)}
        >
          <Tooltip title="Mute">
            <IconButton sx={sxIconButton} onClick={() => handleChangeVolumeSlider(volume ? 0 : 10)}>
              <SlackIcon icon={volume ? "volume-up" : "volume-off-alt"} />
            </IconButton>
          </Tooltip>
          {isHoverVolume && (
            <Slider
              className="hide-thumb"
              value={volume}
              min={0}
              max={10}
              sx={{ width: 70, ml: 1, py: 1 }}
              onChange={(_, value) => handleChangeVolumeSlider(value as number)}
            />
          )}
        </Box>
      );
    };

    const renderSpeedButton = () => {
      return (
        <Tooltip title="Playback speed">
          <Button variant="text" sx={{ ...sxIconButton, p: 0 }} onClick={() => {}}>
            <Select variant="standard" value={speed} onChange={handleChangeSpeed}>
              <MenuItem disabled>
                <Typography>Playback Speed</Typography>
              </MenuItem>
              <MenuItem value="0.25">0.25x</MenuItem>
              <MenuItem value="0.5">0.5x</MenuItem>
              <MenuItem value="0.75">0.75x</MenuItem>
              <MenuItem value="1">1x</MenuItem>
              <MenuItem value="1.25">1.25x</MenuItem>
              <MenuItem value="1.5">1.5x</MenuItem>
              <MenuItem value="2">2x</MenuItem>
            </Select>
          </Button>
        </Tooltip>
      );
    };

    const renderCaptionButton = () => {
      return (
        <Tooltip title={`Turn ${isCaption ? "off" : "on"} captions`}>
          <IconButton sx={sxIconButton} onClick={() => setCaption(!isCaption)}>
            <SlackIcon icon={isCaption ? "cc-filled" : "cc"} />
          </IconButton>
        </Tooltip>
      );
    };

    const renderOpenInButton = () => {
      return (
        <Tooltip title="Open in...">
          <IconButton sx={sxIconButton} onClick={() => {}}>
            <SlackIcon icon="new-window" />
          </IconButton>
        </Tooltip>
      );
    };

    const renderTranscriptButton = () => {
      if (!scripts?.length || !userOwner || !created) return <></>;

      return (
        <>
          <Tooltip title={isFullScreen ? "Show thread & transcript" : "View transcript"}>
            <IconButton
              ref={transcriptButtonRef}
              sx={sxIconButton}
              onClick={isFullScreen ? onClickTranscript : () => setShowTranscriptModal(true)}
            >
              <SlackIcon icon={isFullScreen ? "side-panel" : "list"} />
            </IconButton>
          </Tooltip>
          {!isFullScreen && (
            <TranscriptModal
              isOpen={isShowTranscriptModal}
              anchorEl={transcriptButtonRef.current}
              scripts={scripts}
              created={created}
              user={userOwner}
              onClickScript={handleChangeProgressSlider}
              onClose={() => setShowTranscriptModal(false)}
            />
          )}
        </>
      );
    };

    return (
      <Box
        position={isFullScreen ? undefined : "relative"}
        width="100%"
        color={color.LIGHT}
        bgcolor={isFullScreen ? undefined : color.SECONDARY_BACKGROUND}
        style={style}
        onMouseOver={() => setHover(true)}
        onMouseLeave={() => setHover(isFullScreen)}
      >
        <Video
          ref={videoRef}
          src={src}
          poster={thumbnail}
          ratio={ratio}
          onPause={() => setPlaying(false)}
          onPlaying={() => setPlaying(true)}
          onTimeUpdate={(event) =>
            setCurrentTime(Math.floor((event.target as HTMLVideoElement).currentTime))
          }
          onVolumeChange={(event) =>
            setVolume(Math.floor((event.target as HTMLVideoElement).volume * 10))
          }
          {...videoProps}
        />

        {/* controls */}
        <Box
          position="absolute"
          top={isFullScreen ? "auto" : 0}
          bottom={0}
          left={0}
          right={0}
          display="flex"
          flexDirection="column"
          justifyContent="space-between"
          p={2}
          sx={{
            backgroundImage:
              isHover && !isFullScreen
                ? "linear-gradient(rgba(29, 28, 29, 0), rgba(29, 28, 29, 0.7) 70%)"
                : undefined,
          }}
          style={controlStyle}
        >
          {/* top controls */}
          {isHover && !isFullScreen && (
            <Box>
              <Box display="flex" justifyContent="end">
                {renderExpandButton()}
                {renderMoreButton()}
              </Box>
            </Box>
          )}

          {/* free space */}
          <Box flex="1" onClick={handlePlayPause} />

          {/* bottom controls */}
          <Box>
            {isHover && renderProgressBar()}

            {/* actions */}
            <Box display="flex" justifyContent="space-between">
              <Box display="flex">
                {renderPlayButton()}
                {isHover && renderVolumeButton()}
                {isFullScreen && renderDurationTime()}
              </Box>

              {/* right actions */}
              {isHover && (
                <Box>
                  {renderSpeedButton()}
                  {renderCaptionButton()}
                  {renderTranscriptButton()}
                  {isFullScreen && renderOpenInButton()}
                  {isFullScreen && renderMoreButton()}
                </Box>
              )}
            </Box>
          </Box>
        </Box>
      </Box>
    );
  }
);

export default PlayerBase;
