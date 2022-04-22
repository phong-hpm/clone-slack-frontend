import { FC, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import io from "socket.io-client";

import { useSelector } from "../../store";

import * as authSelectors from "../../store/selectors/auth.selector";
import * as teamsSelectors from "../../store/selectors/teams.selector";

import { ChanelType, setChanelList, setDirectMessagesList } from "../../store/slices/chanels.slice";
import { setUserList } from "../../store/slices/users.slice";

import Chanel from "./Chanels";

const Team: FC = () => {
  const dispatch = useDispatch();
  const { teamId, chanelId } = useParams();
  const navigate = useNavigate();

  const user = useSelector(authSelectors.getUser);
  const teamList = useSelector(teamsSelectors.getTeamList);

  const handleChangeTeam = (id: string) => {
    navigate(`/${id}/${chanelId}`);
  };

  useEffect(() => {
    const socket = io(`ws://localhost:8000/${teamId}`, { autoConnect: false });
    socket.auth = { email: user.email, name: user.name };

    socket.on("connect", () => {
      console.log("chanel connected");
      socket.emit("load-chanels", { userId: user.id });
    });

    socket.on("chanels-data", (data) => {
      const { chanels, users } = data;
      dispatch(setUserList(users));

      const chanelsList: ChanelType[] = [];
      const directMessagesList: ChanelType[] = [];
      chanels.forEach((chanel: ChanelType) =>
        chanel.type === "direct_message"
          ? directMessagesList.push(chanel)
          : chanelsList.push(chanel)
      );

      dispatch(setChanelList(chanelsList));
      dispatch(setDirectMessagesList(directMessagesList));
    });

    if (teamId && user.id) socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [teamId, user, dispatch]);

  return (
    <div>
      <h3>Teams</h3>
      {teamList.map((team) => {
        return (
          <div key={team.id}>
            <div onClick={() => handleChangeTeam(team.id)}>{team.name}</div>
          </div>
        );
      })}
      <Routes>
        <Route path="/:chanelId" element={<Chanel />} />
      </Routes>
    </div>
  );
};

export default Team;
