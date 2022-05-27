import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

export const getTeamUsersState = (state: RootState) => state.teamUsers;

export const getTeamUserList = createSelector([getTeamUsersState], (users) => users.list);
export const getTeamUserById = (id: string) => {
  return createSelector([getTeamUserList], (teamUserList) =>
    teamUserList.find((user) => user.id === id)
  );
};
