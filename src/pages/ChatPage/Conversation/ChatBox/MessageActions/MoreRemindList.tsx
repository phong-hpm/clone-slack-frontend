import { FC } from "react";

// components
import { Box, List, MenuItem, Typography } from "@mui/material";

// utils
import { color } from "utils/constants";

export interface MoreRemindListProps {}

const MoreRemindList: FC<MoreRemindListProps> = () => {
  return (
    <List component="div" disablePadding>
      <MenuItem>
        <Typography>In 20 minutes</Typography>
      </MenuItem>
      <MenuItem>
        <Typography>In 1 hour</Typography>
      </MenuItem>
      <MenuItem>
        <Typography>In 3 hours</Typography>
      </MenuItem>
      <MenuItem>
        <Typography>Tomorrow</Typography>
      </MenuItem>
      <MenuItem>
        <Typography>Next week</Typography>
      </MenuItem>
      <MenuItem>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography>Custom...</Typography>
          <Typography color={color.HIGH}>M</Typography>
        </Box>
      </MenuItem>
    </List>
  );
};

export default MoreRemindList;
