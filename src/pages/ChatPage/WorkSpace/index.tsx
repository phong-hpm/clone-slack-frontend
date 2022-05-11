import { FC, useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import * as channelsSelectors from "store/selectors/channels.selector";

// redux slices
import { setSelectedChannelId } from "store/slices/channels.slice";

// utils
import { color } from "utils/constants";

// hooks
import useChannelSocket from "pages/ChatPage/hooks/useChannelSocket";

// components
import Channels from "./Channel";
import { Box } from "@mui/system";
import WorkSpaceSidebar from "pages/ChatPage/WorkSpace/WorkSpaceSidebar";

// contexts
import ChannelSocketProvider from "pages/ChatPage/Context/ChannelSocketContext";

const WorkSpace: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedChannelId = useSelector(channelsSelectors.getSelectedChannelId);
  const channelList = useSelector(channelsSelectors.getChannelList);

  const { handleSendChannel } = useChannelSocket();

  // after got channelList
  // when selectedChannelId is emtpy
  // set general channel as selected channel
  useEffect(() => {
    if (selectedChannelId || !channelList.length) return;

    const generalChannel = channelList.find((channel) => channel.name === "general")!;

    dispatch(setSelectedChannelId(generalChannel.id));
    navigate(generalChannel.id);
  }, [selectedChannelId, channelList, navigate, dispatch]);

  return (
    <Box
      flexBasis={260}
      bgcolor={color.BG_WORK_SPACE}
      color={color.SILVER_QUICK}
      borderRight={1}
      borderColor={color.BORDER}
    >
      <ChannelSocketProvider>
        <WorkSpaceSidebar />
        <Routes>
          <Route path="/:channelId" element={<Channels onAddChannel={handleSendChannel} />} />
        </Routes>
      </ChannelSocketProvider>
    </Box>
  );
};

export default WorkSpace;
