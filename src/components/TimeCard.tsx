import { FC } from "react";

// components
import { Tooltip, Typography, TypographyProps } from "@mui/material";

// utils
import { dayFormat } from "utils/dayjs";

export interface TimeCardProps {
  time: number;
  formatFn?: (time: number) => string;
  children?: React.ReactNode;
  typographyProps?: TypographyProps;
}

const TimeCard: FC<TimeCardProps> = ({ time, formatFn, typographyProps, children }) => {
  return (
    <Tooltip title={`${dayFormat.dayO(time)} at ${dayFormat.fullTimeA(time)}`}>
      <Typography variant="h6" {...typographyProps}>
        {children || (formatFn ? formatFn(time) : dayFormat.time(time))}
      </Typography>
    </Tooltip>
  );
};

export default TimeCard;
