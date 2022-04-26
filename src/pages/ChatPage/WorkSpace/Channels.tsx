import { FC, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// redux store
import { useDispatch, useSelector } from "../../../store";

// redux selector
import * as channelsSelectors from "../../../store/selectors/channels.selector";

// components
import { Box } from "@mui/material";
import { setSelectedChannelId } from "../../../store/slices/channels.slice";
import CreateChannelModal from "./CreateChannelModal";
import ChannelList from "./ChannelList";

export interface ChannelProps {
  onAddChannel: (channelName: string, desc: string) => void;
}

const ChannelContent: FC<ChannelProps> = ({ onAddChannel }) => {
  const navigate = useNavigate();
  const { teamId } = useParams();
  const dispatch = useDispatch();

  const channelList = useSelector(channelsSelectors.getChannelList);
  const directMessagesList = useSelector(channelsSelectors.getDirectMessagesList);
  const selectedChannelId = useSelector(channelsSelectors.getSelectedChannelId);

  const [openModal, setOpenModal] = useState(false);

  const selectedChannel = useMemo(
    () => channelList.find((channel) => channel.id === selectedChannelId),
    [selectedChannelId, channelList]
  );

  const selectedDirectMessage = useMemo(
    () => directMessagesList.find((channel) => channel.id === selectedChannelId),
    [selectedChannelId, directMessagesList]
  );

  const handleAddChannel = (channelName: string, desc: string) => {
    onAddChannel(channelName, desc);
    setOpenModal(false);
  };

  const handleSelectChannel = (id: string) => {
    dispatch(setSelectedChannelId(id));
    navigate(`/${teamId}/${id}`);
  };

  return (
    <Box>
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
        selectedChannel={selectedDirectMessage}
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
