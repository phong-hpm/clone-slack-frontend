import { FC, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Truncate from "react-truncate";

// components
import {
  Box,
  Chip,
  Collapse,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  Typography,
} from "@mui/material";
import SlackIcon from "components/SlackIcon";
import UserAvatarStatus from "components/UserAvatarStatus";
import UserAvatarLength from "components/UserAvatarLength";

// types
import { ChannelType } from "store/slices/_types";
import { routePaths } from "utils/constants";

export interface ChannelListProps {
  label: string;
  selectedChannel?: ChannelType;
  channels: ChannelType[];
  onClickAdd?: () => void;
  addText?: string;
}

const ChannelList: FC<ChannelListProps> = ({
  label,
  selectedChannel,
  channels,
  addText,
  onClickAdd,
}) => {
  const navigate = useNavigate();
  const params = useParams();

  const truncateContainerRef = useRef<HTMLDivElement>(null);
  const truncateRefs = useRef<Record<string, Truncate | null>>({});
  const keepRef = useRef<{ teamId?: string }>({});
  keepRef.current.teamId = params.teamId;

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMouseEnter, setIsMouseEnter] = useState(false);
  const [selectedId, setSelectedId] = useState("");

  const hasSelectedChannel = useMemo(() => {
    return !!channels.find(({ id }) => id === selectedChannel?.id);
  }, [selectedChannel, channels]);

  const handleClickAdd = (event: React.MouseEvent) => {
    event.stopPropagation();
    onClickAdd?.();
  };

  const handleSelectChannel = (id: string) => {
    setSelectedId(id);
    navigate(`${routePaths.CHATBOX_PAGE}/${keepRef.current.teamId}/${id}`);
  };

  useEffect(() => {
    if (selectedChannel?.id) setSelectedId(selectedChannel.id);
  }, [selectedChannel?.id]);

  // when container's width changed, trigger resize of truncate
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      Object.values(truncateRefs.current).forEach((ref: any) => ref?.onResize());
    });

    observer.observe(truncateContainerRef.current!);
  }, []);

  const renderItem = (channel: ChannelType, isSelected: boolean) => {
    return (
      <ListItemButton
        key={channel.id}
        selected={isSelected}
        sx={{ p: 0, pl: 4 }}
        onClick={() => handleSelectChannel(channel.id)}
      >
        <ListItemIcon sx={{ minWidth: 28 }}>
          {["public_channel", "general"].includes(channel.type) && (
            <SlackIcon icon="channel-pane-hash" />
          )}
          {channel.type === "private_channel" && <SlackIcon icon="lock-o" />}
          {channel.type === "direct_message" && (
            <UserAvatarStatus
              sizes="small"
              src={channel.partner?.avatar}
              isOnline={channel.partner?.isOnline}
            />
          )}
          {channel.type === "group_message" && (
            <UserAvatarLength src={channel.avatar} length={channel.users.length - 1} />
          )}
        </ListItemIcon>
        <Box display="flex" justifyContent="space-between" alignItems="center" width="100%" pr={2}>
          <Box sx={{ lineHeight: "28px", width: "100%" }}>
            <Truncate ref={(ref) => (truncateRefs.current[channel.id] = ref)}>
              {channel.name}
            </Truncate>
          </Box>

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
              <IconButton size="small">
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

      <Collapse ref={truncateContainerRef} in={!isCollapsed} timeout={0} unmountOnExit>
        <List component="div" disablePadding>
          {channels.map((channel) => {
            const isSelected = channel.id === selectedId;

            return renderItem(channel, isSelected);
          })}
          {addText && (
            <ListItemButton sx={{ p: 0, pl: 4 }} onClick={handleClickAdd}>
              <ListItemIcon sx={{ minWidth: 28 }}>
                <SlackIcon icon="plus-small" />
              </ListItemIcon>
              <Typography sx={{ lineHeight: "28px" }}>{addText}</Typography>
            </ListItemButton>
          )}
        </List>
      </Collapse>

      {isCollapsed && selectedChannel && hasSelectedChannel && renderItem(selectedChannel, true)}
    </>
  );
};

export default ChannelList;
