import { FC } from "react";

// components
import { Box, BoxProps } from "@mui/material";

export interface ModalFooterProps extends BoxProps {
  isBorder?: boolean;
  children: string | JSX.Element | JSX.Element[];
}

export const ModalFooter: FC<ModalFooterProps> = ({ isBorder, children, ...props }) => {
  return (
    <Box
      px={3}
      py={2.5}
      sx={{ borderTop: isBorder ? "1px solid rgba(232, 232, 232, 0.13)" : "" }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ModalFooter;
