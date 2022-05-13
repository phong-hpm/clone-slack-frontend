import { forwardRef } from "react";

// components
import { Box, BoxProps } from "@mui/material";

export interface VideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  ratio?: number;
  boxProps?: BoxProps;
}

const Video = forwardRef<HTMLVideoElement, VideoProps>(
  ({ ratio, style, boxProps, ...props }, ref) => {
    return ratio ? (
      <Box position="relative" paddingTop={`${ratio * 100}%`} {...boxProps}>
        <video
          {...props}
          ref={ref}
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            width: "100%",
            height: "100%",
            ...style,
          }}
        />
      </Box>
    ) : (
      <video {...props} ref={ref} style={style} />
    );
  }
);

export default Video;
