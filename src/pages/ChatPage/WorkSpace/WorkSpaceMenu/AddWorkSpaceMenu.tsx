import { FC } from "react";

// components
import { List, MenuItem, Typography } from "@mui/material";

export interface AddWorkSpaceMenuProps {}

const AddWorkSpaceMenu: FC<AddWorkSpaceMenuProps> = () => {
  return (
    <List component="div" disablePadding>
      <MenuItem>
        <Typography>Signin to another workspace</Typography>
      </MenuItem>
      <MenuItem>
        <Typography>Create new a workspace</Typography>
      </MenuItem>
      <MenuItem>
        <Typography>Find workspaces</Typography>
      </MenuItem>
    </List>
  );
};

export default AddWorkSpaceMenu;
