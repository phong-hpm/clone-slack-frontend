import { forwardRef, useImperativeHandle, useRef, useState } from "react";

// components
import { Box, BoxProps } from "@mui/material";

export interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  ratio?: number;
  boxProps?: BoxProps;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(
  ({ ratio: ratioProp, style, boxProps, ...props }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);

    const [ratio, setRatio] = useState(ratioProp || 0);

    useImperativeHandle(ref, () => videoRef.current!);

    const handleCanPlay = () => {
      if (!videoRef.current) return;
      const { videoWidth = 1, videoHeight = 0 } = videoRef.current;
      setRatio(Math.floor((videoHeight / videoWidth) * 10e6) / 10e6);
    };

    return ratio ? (
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
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            ...style,
          }}
          onCanPlay={handleCanPlay}
        />
      </Box>
    ) : (
      <video {...props} ref={videoRef} style={style} />
    );
  }
);

export default Video;
