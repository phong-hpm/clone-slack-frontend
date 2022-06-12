import { FC } from "react";

// components
import { List, MenuItem, Typography } from "@mui/material";

export interface AdministrationMenuProps {
  userName: string;
}

const AdministrationMenu: FC<AdministrationMenuProps> = ({ userName }) => {
  return (
    <List component="div" disablePadding>
      <MenuItem>
        <Typography>Customize {userName}</Typography>
      </MenuItem>
      <MenuItem>
        <Typography>Manage apps</Typography>
      </MenuItem>
    </List>
  );
};

export default AdministrationMenu;
