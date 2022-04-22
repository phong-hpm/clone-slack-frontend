import { createSelector } from "reselect";

import { RootState } from "..";

export const getTeams = (state: RootState) => state.teams;

export const isLoading = createSelector([getTeams], (teams) => teams.isLoading);

export const getSelected = createSelector([getTeams], (teams) => teams.selected);
export const getTeamList = createSelector([getTeams], (teams) => teams.list);
