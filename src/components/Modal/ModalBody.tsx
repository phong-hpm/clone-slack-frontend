import { FC } from "react";

// components
import { Box, BoxProps } from "@mui/material";

export interface ModalBodyProps extends BoxProps {
  children: string | JSX.Element | JSX.Element[];
}

const ModalBody: FC<ModalBodyProps> = ({ children, ...props }) => {
  return (
    <Box flex="1" px={3} pb={2.5} {...props}>
      {children}
    </Box>
  );
};

export default ModalBody;
