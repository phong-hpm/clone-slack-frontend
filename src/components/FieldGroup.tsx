import { FC } from "react";

// components
import { Box, BoxProps, SxProps } from "@mui/material";

// utils
import { color } from "utils/constants";
import mapMarketingSources from "utils/mapMarketingSources";

export interface FieldGroupProps extends BoxProps {
  isGroupHead?: boolean;
  isGroupBody?: boolean;
  isGroupFooter?: boolean;
  imageSrc?: string;
}

const FieldGroup: FC<FieldGroupProps> = ({
  isGroupHead,
  isGroupBody,
  isGroupFooter,
  imageSrc,
  sx: sxProp,
  onClick,
  children,
  ...props
}) => {
  let sx: SxProps = {};

  if (onClick) {
    sx = { cursor: "pointer", ":hover": { bgcolor: "transparent" } };
  }

  if (isGroupHead) {
    sx = {
      ...sx,
      mb: 0,
      borderBottom: `1px solid ${color.BORDER}`,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    };
  }

  if (isGroupBody) {
    sx = { ...sx, my: 0, borderTop: 0, borderRadius: 0 };
  }

  if (isGroupFooter) {
    sx = { ...sx, mt: 0, borderTop: 0, borderTopLeftRadius: 0, borderTopRightRadius: 0 };
  }

  if (imageSrc) {
    sx = { ...sx, display: "flex" };
  }

  return (
    <Box
      borderRadius={3}
      mx={3}
      my={2}
      px={2.5}
      py={2}
      border={`1px solid ${color.BORDER}`}
      bgcolor={color.PRIMARY_BACKGROUND}
      overflow="hidden"
      sx={{ ...sx, ...sxProp }}
      onClick={onClick}
      {...props}
    >
      <Box>{children}</Box>
      {imageSrc && (
        <Box my={-2} ml={2} mr={-2.5} width={148}>
          <img {...mapMarketingSources(imageSrc, "chatbox")} alt="" style={{ width: 148 }} />
        </Box>
      )}
    </Box>
  );
};

export default FieldGroup;
