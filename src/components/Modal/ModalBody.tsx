import { Box } from "@mui/material";
import { FC } from "react";

export interface ModalBodyProps {
  children: string | JSX.Element | JSX.Element[];
}

const ModalBody: FC<ModalBodyProps> = ({ children }) => {
  return <Box px={3.5}>{children}</Box>;
};

export default ModalBody;
