import { FC } from "react";

// components
import { Divider, Menu, MenuProps, MenuItem, Typography } from "@mui/material";

// utils
import { color } from "utils/constants";

export interface MoreMenuProps extends MenuProps {
  type?: "video" | "audio";
  onClickDelete?: () => void;
}

const MoreMenu: FC<MoreMenuProps> = ({ type, onClickDelete, onClose, ...props }) => {
  return (
    <Menu
      variant="menu"
      MenuListProps={{ sx: { minWidth: 300 } }}
      onClose={onClose}
      onClick={() => onClose && onClose({}, "backdropClick")}
      {...props}
    >
      {type === "video" && <MenuItem onClick={() => {}}>Open in thread</MenuItem>}
      <MenuItem onClick={() => {}}>Open in new window</MenuItem>
      {type === "video" && <MenuItem onClick={() => {}}>View details</MenuItem>}
      {type === "audio" && <MenuItem onClick={() => {}}>Download</MenuItem>}

      <Divider />

      {type === "video" && <MenuItem onClick={() => {}}>Download</MenuItem>}
      <MenuItem onClick={() => {}}>Share clip...</MenuItem>
      <MenuItem onClick={() => {}}>Copy link to {type} clip</MenuItem>
      {type === "audio" && <MenuItem onClick={() => {}}>View details</MenuItem>}
      <MenuItem onClick={() => {}}>Add to saved items</MenuItem>
      {type === "video" && <MenuItem onClick={() => {}}>Edit thumbnail...</MenuItem>}

      <Divider />

      <MenuItem onClick={onClickDelete}>
        <Typography color={color.DANGER}>Delete clip</Typography>
      </MenuItem>
    </Menu>
  );
};

export default MoreMenu;
