import { FC } from "react";
import { useNavigate } from "react-router-dom";

// redux store
import { useDispatch, useSelector } from "../store";

// redux selectors
import * as teamsSelectors from "../store/selectors/teams.selector";

// redux slices
import { setSelectedTeamId } from "../store/slices/teams.slice";

const TeamPage: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const teamList = useSelector(teamsSelectors.getTeamList);

  const handleSelectTeam = (id: string) => {
    dispatch(setSelectedTeamId(id));
    navigate(`/${id}`);
  };

  return (
    <div>
      <h3>TeamPage</h3>
      {teamList.map((team) => {
        return (
          <div key={team.id}>
            <div onClick={() => handleSelectTeam(team.id)}>{team.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamPage;
