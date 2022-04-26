import { Box } from "@mui/material";
import { FC } from "react";

export interface ModalFooterProps {
  children: string | JSX.Element | JSX.Element[];
}

export const ModalFooter: FC<ModalFooterProps> = ({ children }) => {
  return (
    <Box px={3.5} py={2.5}>
      {children}
    </Box>
  );
};

export default ModalFooter;
