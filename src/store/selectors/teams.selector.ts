import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

const getTeams = (state: RootState) => state.teams;

const isLoading = createSelector([getTeams], (teams) => teams.isLoading);
const isWaiting = createSelector([getTeams], (teams) => teams.isWaiting);

const getSelectedTeamId = createSelector([getTeams], (teams) => teams.selectedId);
const getTeamList = createSelector([getTeams], (teams) => teams.list);

const teamsSelectors = { isLoading, isWaiting, getSelectedTeamId, getTeamList };

export default teamsSelectors;
