import { createSelector } from "reselect";

// redux store
import { RootState } from "..";

export const getTeams = (state: RootState) => state.teams;

export const isLoading = createSelector([getTeams], (teams) => teams.isLoading);

export const getSelectedId = createSelector([getTeams], (teams) => teams.selectedId);
export const getTeamList = createSelector([getTeams], (teams) => teams.list);
