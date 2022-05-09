import { FC, useState } from "react";

// redux slices
import { ChannelType } from "../../../../store/slices/channels.slice";

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
import SlackIcon from "../../../../components/SlackIcon";

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
  const [isMouseEnter, setIsMouseEnter] = useState(false);

  const handleClickAdd = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClickAdd();
  };

  const handleClickSelect = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <>
      <Box
        display="flex"
        mt={1}
        px={1.25}
        py={0.75}
        onClick={() => setIsCollapsed(!isCollapsed)}
        onMouseEnter={() => setIsMouseEnter(true)}
        onMouseLeave={() => setIsMouseEnter(false)}
        sx={{ cursor: "pointer" }}
      >
        <Box mr={1}>
          <IconButton size="small">
            <SlackIcon icon={isCollapsed ? "caret-right" : "caret-down"} />
          </IconButton>
        </Box>
        <Typography flex="1">{label}</Typography>
        {isMouseEnter && (
          <>
            <Box ml={1}>
              <IconButton size="small" onClick={handleClickSelect}>
                <SlackIcon icon="ellipsis-vertical-filled" />
              </IconButton>
            </Box>
            <Box ml={1}>
              <IconButton size="small" onClick={handleClickAdd}>
                <SlackIcon icon="plus" />
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
                  <SlackIcon icon="channel-pane-hash" />
                </ListItemIcon>
                <Typography sx={{ lineHeight: "28px" }}>{channel.name}</Typography>
              </ListItemButton>
            );
          })}
          <ListItemButton sx={{ p: 0, pl: 4 }} onClick={handleClickAdd}>
            <ListItemIcon sx={{ minWidth: 28 }}>
              <SlackIcon icon="plus-small" />
            </ListItemIcon>
            <Typography sx={{ lineHeight: "28px" }}>{addText}</Typography>
          </ListItemButton>
        </List>
      </Collapse>
      {isCollapsed && selectedChannel && (
        <ListItemButton selected={true} sx={{ p: 0, pl: 4 }}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <SlackIcon icon="channel-pane-hash" />
          </ListItemIcon>
          <ListItemText primary={selectedChannel.name} />
        </ListItemButton>
      )}
    </>
  );
};

export default ChannelList;
