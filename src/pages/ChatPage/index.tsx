import { FC, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

// redux store
import { useSelector } from "../../store";

// redux selectors
import * as teamsSelectors from "../../store/selectors/teams.selector";

// redux slices
import { setSelectedChanelId } from "../../store/slices/chanels.slice";
import { setSelectedTeamId } from "../../store/slices/teams.slice";

// utils
import { RouterPath, teamIdRegExp, chanelIdRegExp } from "../../utils/constants";

// components
import ChatBox from "./Chanels";
import Messages from "./Messages";

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

  // check chanelId param after teamId was checked
  useEffect(() => {
    // wait for checking teamId
    if (!selectedTeamId) return;

    if (params["*"] && chanelIdRegExp.test(params["*"])) {
      dispatch(setSelectedChanelId(params["*"]));
    }
    setIsCheckingParams(false);
  }, [selectedTeamId, params, navigate, dispatch]);

  // render children after teamId and chanelId were checkced
  if (isCheckingPrams) return <></>;

  return (
    <div className="chat-page">
      <ChatBox />
      <Messages />
    </div>
  );
};

export default ChatPage;
