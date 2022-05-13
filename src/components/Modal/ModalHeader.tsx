import { FC } from "react";

// components
import { Box, BoxProps } from "@mui/material";

export interface ModalHeaderProps extends BoxProps {
  isBorder?: boolean;
  children?: string | JSX.Element | JSX.Element[];
}

const ModalHeader: FC<ModalHeaderProps> = ({ isBorder, children, ...props }) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      minHeight={32}
      py={2.5}
      pl={3}
      pr={6}
      sx={{ borderBottom: isBorder ? "1px solid rgba(232, 232, 232, 0.13)" : "" }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ModalHeader;
