import { FC } from "react";

// components
import { List, MenuItem, Typography } from "@mui/material";

export interface ToolsMenuProps {}

const ToolsMenu: FC<ToolsMenuProps> = () => {
  return (
    <List component="div" disablePadding>
      <MenuItem>
        <Typography>Workflow builder</Typography>
      </MenuItem>
      <MenuItem>
        <Typography>Analytics</Typography>
      </MenuItem>
    </List>
  );
};

export default ToolsMenu;
