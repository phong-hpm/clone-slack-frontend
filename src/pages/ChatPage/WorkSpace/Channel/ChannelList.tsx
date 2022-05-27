import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// redux store
import { useSelector } from "store";

// redux selector
import * as channelsSelectors from "store/selectors/channels.selector";

// components
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import SlackIcon from "components/SlackIcon";

// types
import { ChannelType } from "store/slices/_types";
import UserAvatarStatus from "components/UserAvatarStatus";

export interface ChannelListProps {
  label: string;
  channels: ChannelType[];
  onClickAdd: () => void;
  addText: string;
}

const ChannelList: FC<ChannelListProps> = ({ label, channels, addText, onClickAdd }) => {
  const navigate = useNavigate();
  const { teamId } = useParams();

  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

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
                onClick={() => !isSelected && navigate(`/${teamId}/${channel.id}`)}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {!!channel.partner ? (
                    <UserAvatarStatus
                      sizes="small"
                      src={channel.partner.avatar}
                      isOnline={channel.partner.isOnline}
                    />
                  ) : (
                    <SlackIcon icon="channel-pane-hash" />
                  )}
                </ListItemIcon>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  width="100%"
                  pr={2}
                >
                  <Typography sx={{ lineHeight: "28px" }}>{channel.name}</Typography>
                  {!!channel.unreadMessageCount && (
                    <Chip
                      color="error"
                      size="small"
                      label={channel.unreadMessageCount}
                      sx={{ height: 18 }}
                    />
                  )}
                </Box>
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
