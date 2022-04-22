import { createSelector } from "reselect";

import { RootState } from "..";

export const getChanels = (state: RootState) => state.chanels;

export const isLoading = createSelector([getChanels], (chanels) => chanels.isLoading);

export const getSelected = createSelector([getChanels], (chanels) => chanels.selected);
export const getChanelList = createSelector([getChanels], (chanels) => chanels.list);
export const getDirectMessagesList = createSelector(
  [getChanels],
  (chanels) => chanels.directMessages
);
