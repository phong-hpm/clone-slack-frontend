import { FC } from "react";

// components
import { Box, List, MenuItem, Typography } from "@mui/material";

// utils
import { color } from "utils/constants";

export interface MoreRemindListProps {}

const MoreRemindList: FC<MoreRemindListProps> = () => {
  return (
    <List component="div" disablePadding>
      <MenuItem onClick={() => {}}>
        <Typography>In 20 minutes</Typography>
      </MenuItem>
      <MenuItem onClick={() => {}}>
        <Typography>In 1 hour</Typography>
      </MenuItem>
      <MenuItem onClick={() => {}}>
        <Typography>In 3 hours</Typography>
      </MenuItem>
      <MenuItem onClick={() => {}}>
        <Typography>Tomorrow</Typography>
      </MenuItem>
      <MenuItem onClick={() => {}}>
        <Typography>Next week</Typography>
      </MenuItem>
      <MenuItem onClick={() => {}}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography>Custom...</Typography>
          <Typography color={color.HIGH}>M</Typography>
        </Box>
      </MenuItem>
    </List>
  );
};

export default MoreRemindList;
