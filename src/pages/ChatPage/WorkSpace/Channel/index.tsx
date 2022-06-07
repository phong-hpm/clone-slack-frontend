import { useMemo } from "react";

// redux store
import { useSelector, useDispatch } from "store";

// redux selector
import channelsSelectors from "store/selectors/channels.selector";

// components
import { Box, List, ListItemButton, ListItemIcon, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import ChannelList from "./ChannelList";
import { setOpenCreateChannelModal } from "store/slices/globalModal.slice";

// types
import { ChannelType } from "store/slices/_types";

const ChannelContent = () => {
  const dispatch = useDispatch();

  const channelList = useSelector(channelsSelectors.getChannelList);
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  const channelData = useMemo(() => {
    const result: Record<string, ChannelType[]> = { starred: [], direct: [], normal: [] };
    channelList.forEach((channel) => {
      if (channel.isStarred) result.starred.push(channel);
      else if (["private_channel", "public_channel", "general"].includes(channel.type))
        result.normal.push(channel);
      else result.direct.push(channel);
    });
    return result;
  }, [channelList]);

  if (!selectedChannel?.id) return <></>;

  return (
    <Box mt={1.5}>
      <List component="div" disablePadding>
        <ListItemButton sx={{ p: 0, pl: 1.25 }} onClick={() => {}}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <SlackIcon fontSize="inherit" icon="mentions" />
          </ListItemIcon>
          <Typography sx={{ lineHeight: "28px" }}>Mentions & reactions</Typography>
        </ListItemButton>

        <ListItemButton sx={{ p: 0, pl: 1.25 }} onClick={() => {}}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <SlackIcon fontSize="inherit" icon="buildings" />
          </ListItemIcon>
          <Typography sx={{ lineHeight: "28px" }}>Slack Connect</Typography>
        </ListItemButton>

        <ListItemButton sx={{ p: 0, pl: 1.25 }} onClick={() => {}}>
          <ListItemIcon sx={{ minWidth: 28 }}>
            <SlackIcon icon="ellipsis-vertical-filled" />
          </ListItemIcon>
          <Typography sx={{ lineHeight: "28px" }}>More</Typography>
        </ListItemButton>
      </List>

      {!!channelData.starred.length && (
        <ChannelList
          label="Starred"
          selectedChannel={selectedChannel}
          channels={channelData.starred}
          onClickAdd={() => dispatch(setOpenCreateChannelModal(true))}
        />
      )}

      <ChannelList
        label="Channels"
        selectedChannel={selectedChannel}
        channels={channelData.normal}
        onClickAdd={() => dispatch(setOpenCreateChannelModal(true))}
        addText="Add channels"
      />

      <ChannelList
        label="Direct messages"
        selectedChannel={selectedChannel}
        channels={channelData.direct}
        onClickAdd={() => dispatch(setOpenCreateChannelModal(true))}
        addText="Add teammates"
      />
    </Box>
  );
};

export default ChannelContent;
