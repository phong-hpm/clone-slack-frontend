import { FC, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import teamsSelectors from "store/selectors/teams.selector";

// redux slices
import { setSelectedTeamId } from "store/slices/teams.slice";
import { setSelectedChannelId } from "store/slices/channels.slice";

// utils
import { routePaths, teamIdRegExp, channelIdRegExp } from "utils/constants";

// components
import { Box } from "@mui/material";
import WorkSpace from "./WorkSpace";
import Conversation from "./Conversation";
import ChatBar from "./ChatBar";
import GlobalModals from "./GlobalModal";
import MessageSocketListener from "pages/ChatPage/SocketListener/MessageSocketListener";
import ChannelSocketListener from "pages/ChatPage/SocketListener/ChannelSocketListener";

export const ChatPage: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const keepRef = useRef<{ teamId?: string }>({});

  const selectedTeamId = useSelector(teamsSelectors.getSelectedTeamId);

  const [isCheckingPrams, setIsCheckingParams] = useState(true);

  // check teamId param, if not match, navigate to teams-page
  useEffect(() => {
    if (!params.teamId || !teamIdRegExp.test(params.teamId)) {
      navigate(routePaths.TEAM_PAGE);
    } else {
      if (keepRef.current.teamId !== params.teamId) {
        keepRef.current.teamId = params.teamId;
        dispatch(setSelectedTeamId(params.teamId));
      }
    }
  }, [params.teamId, navigate, dispatch]);

  // check channelId param after teamId was checked
  useEffect(() => {
    // wait for checking teamId
    if (!selectedTeamId) return;

    if (params["*"] && channelIdRegExp.test(params["*"])) {
      dispatch(setSelectedChannelId(params["*"]));
    }
    setIsCheckingParams(false);
  }, [selectedTeamId, params, navigate, dispatch]);

  // render children after teamId and channelId were checkced
  if (isCheckingPrams) return <></>;

  return (
    <Box display="flex" flexDirection="column" height="100vh">
      <ChatBar />
      {/* 
        minHeight="1px"
        cheat: this box will fit with the rest height of parent,
              althought its height is less than or greater than prarent's height
      */}
      <Box flex="1" display="flex" minHeight="1px">
        <WorkSpace />
        <Conversation />

        <MessageSocketListener />
        <ChannelSocketListener />
      </Box>

      <GlobalModals />
    </Box>
  );
};

export default ChatPage;
