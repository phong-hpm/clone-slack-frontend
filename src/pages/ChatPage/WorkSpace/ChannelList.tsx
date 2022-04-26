import { FC, useState } from "react";

// redux slices
import { ChannelType } from "../../../store/slices/channels.slice";

// components
import {
  Box,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

// icons
import {
  Add as AddIcon,
  ArrowDropDown as ArrowDropDownIcon,
  ArrowRight as ArrowRightIcon,
  MoreVert as MoreVertIcon,
  Tag as TagIcon,
} from "@mui/icons-material";

export interface ChannelListProps {
  label: string;
  channels: ChannelType[];
  selectedChannel?: ChannelType;
  onSelect: (channelId: string) => void;
  onClickAdd: () => void;
  addText: string;
}

const ChannelList: FC<ChannelListProps> = ({
  label,
  channels,
  selectedChannel,
  onSelect,
  addText,
  onClickAdd,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMouseEnter, setIsMouseEnter] = useState(true);

  return (
    <Box>
      <Box
        display="flex"
        px={1.25}
        py={0.75}
        onClick={() => setIsCollapsed(!isCollapsed)}
        onMouseEnter={() => setIsMouseEnter(true)}
        onMouseLeave={() => setIsMouseEnter(false)}
        sx={{ cursor: "pointer" }}
      >
        <Box mr={1}>
          <IconButton sx={{ padding: 0 }}>
            {isCollapsed ? <ArrowRightIcon /> : <ArrowDropDownIcon />}
          </IconButton>
        </Box>
        <Typography flex="1">{label}</Typography>
        {isMouseEnter && (
          <>
            <Box ml={1}>
              <IconButton size="small" sx={{ padding: 0 }}>
                <MoreVertIcon />
              </IconButton>
            </Box>
            <Box ml={1}>
              <IconButton size="small" sx={{ padding: 0 }}>
                <AddIcon />
              </IconButton>
            </Box>
          </>
        )}
      </Box>
      <Collapse in={!isCollapsed} timeout={0} unmountOnExit>
        <List component="div" disablePadding>
          {channels.map((channel) => {
            const isSelected = channel.id === selectedChannel?.id;
            return (
              <ListItemButton
                key={channel.id}
                selected={isSelected}
                sx={{ p: 0, pl: 4 }}
                onClick={() => !isSelected && onSelect(channel.id)}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  <TagIcon fontSize="inherit" />
                </ListItemIcon>
                <Typography sx={{ lineHeight: "28px" }}>{channel.name}</Typography>
              </ListItemButton>
            );
          })}
          <ListItemButton sx={{ p: 0, pl: 4 }} onClick={() => onClickAdd()}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <AddIcon fontSize="small" />
            </ListItemIcon>
            <Typography sx={{ lineHeight: "28px" }}>{addText}</Typography>
          </ListItemButton>
        </List>
      </Collapse>
      {isCollapsed && selectedChannel && (
        <ListItemButton selected={true} sx={{ p: 0, pl: 4 }}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <TagIcon fontSize="inherit" />
          </ListItemIcon>
          <ListItemText primary={selectedChannel.name} />
        </ListItemButton>
      )}
    </Box>
  );
};

export default ChannelList;
