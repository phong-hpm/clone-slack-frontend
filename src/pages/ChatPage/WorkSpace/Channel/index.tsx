import { useState } from "react";

// redux store
import { useSelector } from "store";

// redux selector
import * as channelsSelectors from "store/selectors/channels.selector";

// components
import { Box, List, ListItemButton, ListItemIcon, Typography } from "@mui/material";
import SlackIcon from "components/SlackIcon";
import ChannelList from "./ChannelList";
import CreateChannelModal from "./CreateChannelModal";

const ChannelContent = () => {
  const channelList = useSelector(channelsSelectors.getChannelList);
  const directMessagesList = useSelector(channelsSelectors.getDirectMessagesList);
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  const [openModal, setOpenModal] = useState(false);

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

      <ChannelList
        label="Channels"
        types={["channel"]}
        selectedChannel={selectedChannel}
        channels={channelList}
        onClickAdd={() => setOpenModal(true)}
        addText="Add channels"
      />
      <ChannelList
        label="Direct messages"
        types={["dirrect_message", "group_message"]}
        selectedChannel={selectedChannel}
        channels={directMessagesList}
        onClickAdd={() => setOpenModal(true)}
        addText="Add teammates"
      />

      {openModal && <CreateChannelModal isOpen={openModal} onClose={() => setOpenModal(false)} />}
    </Box>
  );
};

export default ChannelContent;
