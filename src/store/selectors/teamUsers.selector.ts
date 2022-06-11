// types
import { RootState } from "store/_types";

const teamUsersSelectors = {
  getTeamUserList: (state: RootState) => state.teamUsers.list,
};
export default teamUsersSelectors;
