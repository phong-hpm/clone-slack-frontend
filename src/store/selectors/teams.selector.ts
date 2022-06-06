import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

const getTeamsState = (state: RootState) => state.teams;

const isLoading = createSelector([getTeamsState], (teams) => teams.isLoading);
const isWaiting = createSelector([getTeamsState], (teams) => teams.isWaiting);

const getSelectedTeamId = createSelector([getTeamsState], (teams) => teams.selectedId);
const getTeamList = createSelector([getTeamsState], (teams) => teams.list);

const teamsSelectors = { isLoading, isWaiting, getSelectedTeamId, getTeamList };

export default teamsSelectors;
