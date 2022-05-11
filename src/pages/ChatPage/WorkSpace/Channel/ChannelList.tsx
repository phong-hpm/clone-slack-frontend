import { FC, useState } from "react";

// redux store
import { useSelector } from "store";

// redux selector
import * as authSelectors from "store/selectors/auth.selector";
import * as usersSelectors from "store/selectors/users.selector";

// components
import {
  Avatar,
  Box,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import SlackIcon from "components/SlackIcon";
import Status from "components/Status";

// images
import defaultAvatar from "assets/images/default_avatar.png";

// utils
import { color } from "utils/constants";

// types
import { ChannelType } from "store/slices/_types";

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
  const user = useSelector(authSelectors.getUser);
  const userList = useSelector(usersSelectors.getUserList);

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
            let isOnline = false;
            if (channel.type !== "channel") {
              const userPartnerId = channel.users.find((userId) => userId !== user.id);
              const userPartner = userList.find(({ id: userId }) => userId === userPartnerId);
              isOnline = !!userPartner?.isOnline;
            }

            return (
              <ListItemButton
                key={channel.id}
                selected={isSelected}
                sx={{ p: 0, pl: 4 }}
                onClick={() => !isSelected && onSelect(channel.id)}
              >
                <ListItemIcon sx={{ minWidth: 28 }}>
                  {channel.type === "channel" ? (
                    <SlackIcon icon="channel-pane-hash" />
                  ) : (
                    <Box position="relative">
                      <Box position="relative" overflow="hidden">
                        <Box
                          position="absolute"
                          zIndex={1}
                          right={-4}
                          bottom={-3}
                          width={11}
                          height={11}
                          borderRadius={5}
                          bgcolor={color.BG_WORK_SPACE}
                        />
                        <Avatar sizes="small" src={defaultAvatar} />
                      </Box>
                      <Box position="absolute" zIndex={2} right={-6} bottom={-5}>
                        <Status isOnline={isOnline} fontSize="medium" />
                      </Box>
                    </Box>
                  )}
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
