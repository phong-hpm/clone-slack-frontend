import { Box } from "@mui/material";
import { FC } from "react";

export interface ModalHeaderProps {
  children: string | JSX.Element | JSX.Element[];
}

const ModalHeader: FC<ModalHeaderProps> = ({ children }) => {
  return (
    <Box py={2.5} pl={3} pr={9}>
      {children}
    </Box>
  );
};

export default ModalHeader;
