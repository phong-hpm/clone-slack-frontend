import { FC } from "react";

// components
import { Box } from "@mui/material";

export interface ModalBodyProps {
  children: string | JSX.Element | JSX.Element[];
  p?: number;
}

const ModalBody: FC<ModalBodyProps> = ({ p, children }) => {
  return (
    <Box flex="1" px={3} pb={2.5} p={p}>
      {children}
    </Box>
  );
};

export default ModalBody;
