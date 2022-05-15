import { forwardRef, useMemo, useState } from "react";

// components
import { Box, BoxProps } from "@mui/material";
import { color, rgba } from "utils/constants";

export interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  ratio?: number;
  alt?: string;
  boxProps?: BoxProps;
}

const Image = forwardRef<HTMLImageElement, ImageProps>(
  ({ ratio = 0, alt = "", style, boxProps, ...props }, ref) => {
    const [isError, setError] = useState(false);
    const [isLoaded, setLoaded] = useState(false);

    const imageStyle = useMemo(() => {
      if (isError) return { display: "none" };
      if (isLoaded) return { top: "0", left: "0", width: "100%", height: "100%" };
      return { top: "-1px", left: "-1px", width: "calc(100% + 2px)", height: "calc(100% + 2px)" };
    }, [isLoaded, isError]);

    return (
      <Box
        position="relative"
        paddingTop={`${ratio * 100}%`}
        bgcolor={rgba(color.DARK, 0.2)}
        {...boxProps}
      >
        <img
          {...props}
          ref={ref}
          alt={alt}
          style={{ position: ratio ? "absolute" : "inherit", ...imageStyle, ...style }}
          onError={() => setError(true)}
          onLoad={() => setLoaded(true)}
        />
      </Box>
    );
  }
);

export default Image;
