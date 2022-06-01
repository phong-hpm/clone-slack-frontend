import { useEffect } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import channelsSelectors from "store/selectors/channels.selector";

// redux slices
import { setSelectedChannelId } from "store/slices/channels.slice";

// utils
import { color } from "utils/constants";

// components
import { Box } from "@mui/material";
import Channels from "./Channel";
import WorkSpaceSidebar from "pages/ChatPage/WorkSpace/WorkSpaceSidebar";

// contexts
import ChannelSocketProvider from "pages/ChatPage/Context/ChannelSocketContext";

const WorkSpace = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const selectedChannelId = useSelector(channelsSelectors.getSelectedChannelId);
  const channelList = useSelector(channelsSelectors.getChannelList);

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
          <Route path="/:channelId" element={<Channels />} />
        </Routes>
      </ChannelSocketProvider>
    </Box>
  );
};

export default WorkSpace;
