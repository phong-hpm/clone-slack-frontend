import React, { useContext, forwardRef } from "react";

// components
import { IconButton, IconButtonProps } from "@mui/material";

// context
import { VideoPlayerContext } from "../VideoPlayerContext";

// constants
import { bgButton } from "../_constants";

const IconButtonCustom = forwardRef<HTMLButtonElement, IconButtonProps>(({ sx, ...props }, ref) => {
  const { state } = useContext(VideoPlayerContext);

  return (
    <IconButton
      ref={ref}
      size={state.isFullScreen ? "large" : "medium"}
      sx={{
        ml: state.isFullScreen ? 2 : 0.5,
        borderRadius: 1,
        ":hover": { background: bgButton },
        ...sx,
      }}
      {...props}
    />
  );
});

export default IconButtonCustom;
