import { FC } from "react";

// components
import { Divider, Menu, MenuProps, MenuItem, Typography } from "@mui/material";

// utils
import { color } from "utils/constants";

export interface MoreMenuProps extends MenuProps {
  url?: string;
  type?: "video" | "audio";
  onClickEditThumbnail?: () => void;
  onClickDelete?: () => void;
}

const getDownloadMediaUrl = (url?: string) => {
  if (!url) return "";
  const { origin, pathname } = new URL(url);
  const paths = pathname.split("/");
  paths.splice(paths.length - 1, 0, "download");
  return `${origin}${paths.join("/")}`;
};

const getLastPathname = (url?: string) => {
  if (!url) return "";
  const { pathname } = new URL(url);
  const paths = pathname.split("/");
  return paths[paths.length - 1];
};

const MoreMenu: FC<MoreMenuProps> = ({
  url,
  type,
  onClickDelete,
  onClickEditThumbnail,
  onClose,
  ...props
}) => {
  const handleDownload = () => {
    if (!url) return;
    const anchorEl = document.createElement("a");
    anchorEl.download = getLastPathname(url);
    console.log(anchorEl.download);
    anchorEl.href = getDownloadMediaUrl(url);
    anchorEl.click();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(url || "");
  };

  return (
    <Menu
      variant="menu"
      MenuListProps={{ sx: { minWidth: 300 } }}
      onClose={onClose}
      onClick={() => onClose && onClose({}, "backdropClick")}
      {...props}
    >
      {type === "video" && <MenuItem onClick={() => {}}>Open in thread</MenuItem>}
      <MenuItem onClick={() => window.open(getDownloadMediaUrl(url))}>Open in new window</MenuItem>
      {type === "video" && <MenuItem onClick={() => {}}>View details</MenuItem>}
      {type === "audio" && <MenuItem onClick={handleDownload}>Download</MenuItem>}

      <Divider />

      {type === "video" && <MenuItem onClick={handleDownload}>Download</MenuItem>}
      <MenuItem onClick={() => {}}>Share clip...</MenuItem>
      <MenuItem onClick={handleCopy}>Copy link to {type} clip</MenuItem>
      {type === "audio" && <MenuItem onClick={() => {}}>View details</MenuItem>}
      <MenuItem onClick={() => {}}>Add to saved items</MenuItem>
      {type === "video" && <MenuItem onClick={onClickEditThumbnail}>Edit thumbnail...</MenuItem>}

      <Divider />

      <MenuItem onClick={onClickDelete}>
        <Typography color={color.DANGER}>Delete clip</Typography>
      </MenuItem>
    </Menu>
  );
};

export default MoreMenu;
