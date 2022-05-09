import { FC, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// redux store
import { useDispatch, useSelector } from "store";

// redux selector
import * as channelsSelectors from "store/selectors/channels.selector";

// redux slices
import { setSelectedChannelId } from "store/slices/channels.slice";

// components
import { Box, List, ListItemButton, ListItemIcon, Typography } from "@mui/material";
import CreateChannelModal from "./CreateChannelModal";
import ChannelList from "./ChannelList";
import SlackIcon from "components/SlackIcon";

export interface ChannelProps {
  onAddChannel: (channelName: string, desc: string) => void;
}

const ChannelContent: FC<ChannelProps> = ({ onAddChannel }) => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const dispatch = useDispatch();

  const channelList = useSelector(channelsSelectors.getChannelList);
  const directMessagesList = useSelector(channelsSelectors.getDirectMessagesList);
  const selectedChannel = useSelector(channelsSelectors.getSelectedChannel);

  const [openModal, setOpenModal] = useState(false);

  const handleAddChannel = (channelName: string, desc: string) => {
    onAddChannel(channelName, desc);
    setOpenModal(false);
  };

  const handleSelectChannel = (id: string) => {
    dispatch(setSelectedChannelId(id));
    navigate(`/${teamId}/${id}`);
  };

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
        channels={channelList}
        selectedChannel={selectedChannel}
        onSelect={handleSelectChannel}
        onClickAdd={() => setOpenModal(true)}
        addText="Add channels"
      />
      <ChannelList
        label="Direct messages"
        channels={directMessagesList}
        selectedChannel={selectedChannel}
        onSelect={handleSelectChannel}
        onClickAdd={() => setOpenModal(true)}
        addText="Add teammates"
      />

      <CreateChannelModal
        isOpen={openModal}
        onSubmit={handleAddChannel}
        onClose={() => setOpenModal(false)}
      />
    </Box>
  );
};

export default ChannelContent;
