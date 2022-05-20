import { FC, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

// redux store
import { useDispatch, useSelector } from "store";

// redux selectors
import * as teamsSelectors from "store/selectors/teams.selector";

// redux slices
import { setSelectedTeamId } from "store/slices/teams.slice";
import { setSelectedChannelId } from "store/slices/channels.slice";

// utils
import { RouterPath, teamIdRegExp, channelIdRegExp } from "utils/constants";

// components
import { Box } from "@mui/material";
import WorkSpace from "./WorkSpace";
import Conversation from "./Conversation";
import ChatBar from "./ChatBar";

export const ChatPage: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();

  const selectedTeamId = useSelector(teamsSelectors.getSelectedId);

  const [isCheckingPrams, setIsCheckingParams] = useState(true);

  // check teamId param, if not match, navigate to teams-page
  useEffect(() => {
    if (!params.teamId) return;

    if (!teamIdRegExp.test(params.teamId)) {
      navigate(RouterPath.TEAM_PAGE);
    } else {
      dispatch(setSelectedTeamId(params.teamId));
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
      </Box>
    </Box>
  );
};

export default ChatPage;
