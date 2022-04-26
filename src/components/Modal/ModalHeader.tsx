import { Box, Typography } from "@mui/material";
import { FC } from "react";

export interface ModalHeaderProps {
  children: string | JSX.Element | JSX.Element[];
}

const ModalHeader: FC<ModalHeaderProps> = ({ children }) => {
  return (
    <Box py={2.5} pl={3.5} pr={9}>
      <Typography variant="h2">
        <strong>{children}</strong>
      </Typography>
    </Box>
  );
};

export default ModalHeader;
