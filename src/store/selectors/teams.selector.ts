// types
import { RootState } from "store/_types";

const teamsSelectors = {
  isLoading: (state: RootState) => state.teams.isLoading,
  isWaiting: (state: RootState) => state.teams.isWaiting,
  getSelectedTeamId: (state: RootState) => state.teams.selectedId,
  getTeamList: (state: RootState) => state.teams.list,
};

export default teamsSelectors;
