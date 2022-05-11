import { FC } from "react";

// components
import { Box } from "@mui/material";

export interface ModalFooterProps {
  children: string | JSX.Element | JSX.Element[];
}

export const ModalFooter: FC<ModalFooterProps> = ({ children }) => {
  return (
    <Box px={3} py={2.5}>
      {children}
    </Box>
  );
};

export default ModalFooter;
