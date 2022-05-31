import { FC } from "react";

// components
import { Box, BoxProps } from "@mui/material";

// utils
import { color } from "utils/constants";

export interface ModalFooterProps extends BoxProps {
  isBorder?: boolean;
  // this prop will be set by [Modal] component
  isUncontrolledBorder?: boolean;
  children: string | JSX.Element | JSX.Element[];
}

export const ModalFooter: FC<ModalFooterProps> = ({
  isBorder,
  isUncontrolledBorder,
  children,
  ...props
}) => {
  return (
    <Box
      px={3}
      py={2.5}
      sx={{ borderTop: isBorder || isUncontrolledBorder ? `1px solid ${color.BORDER}` : "" }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ModalFooter;
