import { FC } from "react";
import { useNavigate } from "react-router-dom";

// redux store
import { useSelector } from "store";

// redux selectors
import * as teamsSelectors from "store/selectors/teams.selector";

const TeamPage: FC = () => {
  const navigate = useNavigate();

  const teamList = useSelector(teamsSelectors.getTeamList);

  return (
    <div>
      <h3>TeamPage</h3>
      {teamList.map((team) => {
        return (
          <div key={team.id}>
            <div onClick={() => navigate(`/${team.id}`)}>{team.name}</div>
          </div>
        );
      })}
    </div>
  );
};

export default TeamPage;
