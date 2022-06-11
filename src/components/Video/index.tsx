import { forwardRef, useImperativeHandle, useRef, useState } from "react";

// components
import { Box, BoxProps, CircularProgress } from "@mui/material";

// utils
import { color, rgba } from "utils/constants";

// types
import { VideoInstance } from "./_types";

export interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  ratio?: number;
  boxProps?: BoxProps;
  setPlaying?: (bol: boolean) => void;
}

const Video = forwardRef<VideoInstance, VideoProps>(
  ({ ratio: ratioProp, style, boxProps, onWaiting, onPlaying, setPlaying, ...props }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    const [ratio, setRatio] = useState(ratioProp || 0);
    const [isLoading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      videoEl: videoRef.current!,
      containerEl: containerRef.current!,
    }));

    const handleCanPlay = (event: React.SyntheticEvent<HTMLVideoElement>) => {
      setLoading(false);

      const { videoWidth, videoHeight } = event.target as HTMLVideoElement;
      setRatio(Math.floor((videoHeight / videoWidth) * 10e6) / 10e6);
    };

    const handlePause = () => {
      setPlaying && setPlaying(false);
    };

    const handlePlaying = () => {
      setPlaying && setPlaying(true);
    };

    const handleWaiting = () => {
      setLoading(true);
    };

    return (
      <Box ref={containerRef} position="relative" width="100%" maxWidth="100%" maxHeight="100%">
        {ratio ? (
          <Box
            position="relative"
            paddingTop={`${ratio * 100}%`}
            maxWidth="100%"
            maxHeight="100%"
            {...boxProps}
          >
            <video
              {...props}
              ref={videoRef}
              preload="none"
              style={{
                position: "absolute",
                top: "0",
                left: "0",
                ...style,
              }}
              onPause={handlePause}
              onPlaying={handlePlaying}
              onWaiting={handleWaiting}
              onCanPlay={handleCanPlay}
            />
          </Box>
        ) : (
          <video
            {...props}
            ref={videoRef}
            preload="none"
            style={style}
            onPause={handlePause}
            onPlaying={handlePlaying}
            onWaiting={handleWaiting}
            onCanPlay={handleCanPlay}
          />
        )}

        {isLoading && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            zIndex="1000"
            sx={{ transform: "translate(-50%, -50%)" }}
          >
            <Box
              position="absolute"
              width={50}
              height={50}
              borderRadius="50%"
              border="5px solid"
              borderColor={rgba(color.LIGHT, 0.3)}
            />
            <CircularProgress disableShrink color="secondary" size={60} />
          </Box>
        )}
      </Box>
    );
  }
);

export default Video;
