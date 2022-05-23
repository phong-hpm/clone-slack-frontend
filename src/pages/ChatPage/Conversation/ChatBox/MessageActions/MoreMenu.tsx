import { FC, useState } from "react";

// components
import { Box, Divider, Menu, MenuItem, Tooltip, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import MoreRemindList, { MoreRemindListProps } from "./MoreRemindList";

// utils
import { color } from "utils/constants";

export interface MoreMenuProps extends MoreRemindListProps {
  messageId?: string;
  isOwner?: boolean;
  isSystem?: boolean;
  open: boolean;
  anchorEl: HTMLElement | null;
  onClickEdit: () => void;
  onClickDelete: () => void;
  onClose: () => void;
}

const MoreMenu: FC<MoreMenuProps> = ({
  messageId,
  isOwner,
  isSystem,
  open,
  anchorEl,
  onClickEdit,
  onClickDelete,
  onClose,
  ...props
}) => {
  const [isSelectRemind, setSelectRemind] = useState(false);

  return (
    <Menu
      variant="menu"
      open={open}
      anchorEl={anchorEl}
      anchorOrigin={{ vertical: "top", horizontal: "left" }}
      transformOrigin={{ vertical: "top", horizontal: "right" }}
      sx={{ zIndex: 2001 }}
      MenuListProps={{ sx: { minWidth: 300 } }}
      onClose={onClose}
    >
      {!isSystem && <MenuItem onMouseDown={() => {}}>Get notified about new replies</MenuItem>}

      {!isSystem && <Divider />}

      <MenuItem onMouseDown={() => {}}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography>Mark unread</Typography>
          <Typography color={color.HIGH}>U</Typography>
        </Box>
      </MenuItem>

      {!isSystem && (
        <Tooltip
          arrow={false}
          disableInteractive={false}
          classes={{ popper: "tooltip-menu" }}
          placement="left-start"
          title={<MoreRemindList {...props} />}
          onOpen={() => setSelectRemind(true)}
          onClose={() => setSelectRemind(false)}
        >
          <MenuItem selected={isSelectRemind}>
            <Box display="flex" justifyContent="space-between" width="100%">
              <Typography>Remind me about this</Typography>
              <SlackIcon color={color.HIGH} icon="chevron-right" />
            </Box>
          </MenuItem>
        </Tooltip>
      )}

      <Divider />

      <MenuItem onMouseDown={() => {}}>Copy link</MenuItem>

      <Divider />

      {!isSystem && (
        <MenuItem onMouseDown={() => {}}>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography>Pin to channel</Typography>
            <Typography color={color.HIGH}>P</Typography>
          </Box>
        </MenuItem>
      )}

      {isOwner && <Divider />}

      {!isSystem && isOwner && (
        // mousedown → mouseup → click
        // tooltip which render MessageActions will be closed after mousedown
        // in this case, can't use onClick
        <MenuItem onMouseDown={onClickEdit}>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography>Edit message</Typography>
            <Typography color={color.HIGH}>E</Typography>
          </Box>
        </MenuItem>
      )}

      {!isSystem && isOwner && (
        <MenuItem onMouseDown={onClickDelete}>
          <Box display="flex" justifyContent="space-between" width="100%">
            <Typography color={color.DANGER}>Delete message</Typography>
            <Typography color={color.HIGH}>delete</Typography>
          </Box>
        </MenuItem>
      )}

      {!isSystem && <Divider />}

      <MenuItem onMouseDown={() => {}}>
        <Box display="flex" justifyContent="space-between" width="100%">
          <Typography>Add a message shortcut...</Typography>
          <SlackIcon color={color.HIGH} icon="external-link" fontSize="medium" />
        </Box>
      </MenuItem>
    </Menu>
  );
};

export default MoreMenu;
