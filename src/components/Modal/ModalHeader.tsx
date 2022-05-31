import { FC } from "react";

// components
import { Box, BoxProps } from "@mui/material";

// utils
import { color } from "utils/constants";

export interface ModalHeaderProps extends BoxProps {
  isBorder?: boolean;
  // this prop will be set by [Modal] component
  isUncontrolledBorder?: boolean;
  children?: string | JSX.Element | JSX.Element[] | boolean;
}

const ModalHeader: FC<ModalHeaderProps> = ({
  isBorder,
  isUncontrolledBorder,
  children,
  ...props
}) => {
  return (
    <Box
      display="flex"
      alignItems="center"
      minHeight={32}
      py={2.5}
      pl={3}
      pr={7}
      sx={{ borderBottom: isBorder || isUncontrolledBorder ? `1px solid ${color.BORDER}` : "" }}
      {...props}
    >
      {children}
    </Box>
  );
};

export default ModalHeader;
