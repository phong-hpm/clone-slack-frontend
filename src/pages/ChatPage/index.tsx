import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// redux store
import { useSelector } from "../../store";

// redux selectors
import * as teamsSelectors from "../../store/selectors/teams.selector";

// redux slices
import { setSelectedChannelId } from "../../store/slices/channels.slice";
import { setSelectedTeamId } from "../../store/slices/teams.slice";

// utils
import { RouterPath, teamIdRegExp, channelIdRegExp } from "../../utils/constants";

// components
import { Box } from "@mui/material";
import WorkSpace from "./WorkSpace";
import Conversation from "./Conversation";

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
    <Box display="flex" minHeight="100vh">
      <Box flex="0 0 260px" bgcolor="#19171D" borderRight={1} borderColor="rgba(209,210,211,0.1)">
        <WorkSpace />
      </Box>
      <Box flex="1 1 auto" bgcolor="#1A1D21">
        <Conversation />
      </Box>
    </Box>
  );
};

export default ChatPage;
