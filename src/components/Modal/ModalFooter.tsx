import { FC } from "react";

// components
import { Box, BoxProps } from "@mui/material";

// utils
import { color } from "utils/constants";

export interface ModalFooterProps extends BoxProps {
  isBorder?: boolean;
  children: string | JSX.Element | JSX.Element[];
}

export const ModalFooter: FC<ModalFooterProps> = ({ isBorder, children, ...props }) => {
  return (
    <Box px={3} py={2.5} sx={{ borderTop: isBorder ? `1px solid ${color.BORDER}` : "" }} {...props}>
      {children}
    </Box>
  );
};

export default ModalFooter;
