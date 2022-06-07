import { FC } from "react";

// components
import { Typography, TypographyProps } from "@mui/material";

// utils
import { color } from "utils/constants";

export interface ProTagProps extends TypographyProps {}

const ProTag: FC<ProTagProps> = (props) => {
  return (
    <Typography
      component="span"
      py={0.25}
      px={0.375}
      fontSize={10}
      fontWeight={700}
      lineHeight={1.2}
      color={color.PRIMARY_BACKGROUND}
      bgcolor={color.PRIMARY}
      borderRadius={1}
      {...props}
    >
      PRO
    </Typography>
  );
};

export default ProTag;
