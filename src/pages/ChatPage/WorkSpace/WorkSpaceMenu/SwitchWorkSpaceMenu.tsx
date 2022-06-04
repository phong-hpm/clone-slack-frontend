import { FC } from "react";

// components
import { List, MenuItem, Typography } from "@mui/material";

// utils
import { color } from "utils/constants";

export interface SwitchWorkSpaceMenuProps {}

const SwitchWorkSpaceMenu: FC<SwitchWorkSpaceMenuProps> = () => {
  return (
    <List component="div" disablePadding>
      <MenuItem disabled>
        <Typography variant="h5" color={color.HIGH}>
          Your another workspaces
        </Typography>
      </MenuItem>
    </List>
  );
};

export default SwitchWorkSpaceMenu;
