import { FC } from "react";

// components
import { Divider, Menu, MenuProps, MenuItem, Typography } from "@mui/material";

// utils
import { color } from "utils/constants";

// hooks
import useMessageSocket from "pages/ChatPage/hooks/useMessageSocket";

export interface MoreMenuProps extends MenuProps {
  messageId?: string;
  isOwner?: boolean;
  isSystem?: boolean;
  onClickEdit?: () => void;
  onClickDelete?: () => void;
}

const MoreMenu: FC<MoreMenuProps> = ({
  messageId,
  isOwner,
  isSystem,
  onClickEdit,
  onClickDelete,
  ...props
}) => {
  const { emitRemoveMessage } = useMessageSocket();

  const handleDeleteMessage = () => {
    onClickDelete && onClickDelete();
    messageId && emitRemoveMessage(messageId);
  };

  return (
    <Menu variant="menu" MenuListProps={{ sx: { minWidth: 300 } }} {...props}>
      <MenuItem onClick={() => {}}>Open in thread</MenuItem>
      <MenuItem onClick={() => {}}>Open in new window</MenuItem>
      <MenuItem onClick={() => {}}>View details</MenuItem>

      <Divider />

      <MenuItem onClick={() => {}}>Download</MenuItem>
      <MenuItem onClick={() => {}}>Share clip...</MenuItem>
      <MenuItem onClick={() => {}}>Copy link to video clip</MenuItem>
      <MenuItem onClick={() => {}}>Add to saved items</MenuItem>
      <MenuItem onClick={() => {}}>Edit thumbnail...</MenuItem>

      <Divider />

      <MenuItem onClick={handleDeleteMessage}>
        <Typography color={color.DANGER}>Delete clip</Typography>
      </MenuItem>
    </Menu>
  );
};

export default MoreMenu;
