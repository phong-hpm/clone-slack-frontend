import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

const getTeamUsersState = (state: RootState) => state.teamUsers;

const getTeamUserList = createSelector([getTeamUsersState], (users) => users.list);
const getTeamUserById = (id: string) => {
  return createSelector([getTeamUserList], (teamUserList) =>
    teamUserList.find((user) => user.id === id)
  );
};

const teamUsersSelectors = { getTeamUserList, getTeamUserById };

export default teamUsersSelectors;
