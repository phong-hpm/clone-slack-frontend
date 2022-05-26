import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

export const getTeams = (state: RootState) => state.teams;

export const isLoading = createSelector([getTeams], (teams) => teams.isLoading);

export const getSelectedTeamId = createSelector([getTeams], (teams) => teams.selectedId);
export const getTeamList = createSelector([getTeams], (teams) => teams.list);
