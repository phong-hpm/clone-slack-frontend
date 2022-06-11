import { FC } from "react";

// components
import { Box, CircularProgress, CircularProgressProps } from "@mui/material";

// utils
import { rgba, color } from "utils/constants";

export interface LoadingWrapperProps extends CircularProgressProps {
  isLoading?: boolean;
}

const LoadingWrapper: FC<LoadingWrapperProps> = ({ isLoading, children, ...props }) => {
  return (
    <Box position="relative">
      {children}
      {isLoading && (
        <Box
          position="absolute"
          top={0}
          bottom={0}
          left={0}
          right={0}
          bgcolor={rgba(color.DARK, 0.7)}
        >
          <Box position="absolute" top="50%" left="50%" sx={{ transform: "translate(-50%, -50%)" }}>
            <CircularProgress {...props} />
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default LoadingWrapper;
