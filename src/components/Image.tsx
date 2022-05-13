import { forwardRef } from "react";

// components
import { Box, BoxProps } from "@mui/material";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  ratio?: number;
  alt?: string;
  boxProps?: BoxProps;
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ ratio, alt = "", style, boxProps, ...props }, ref) => {
    return ratio ? (
      <Box position="relative" paddingTop={`${ratio * 100}%`} {...boxProps}>
        <img
          {...props}
          ref={ref}
          alt={alt}
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
      <img {...props} alt={alt} style={style} />
    );
  }
);

export default Image;
