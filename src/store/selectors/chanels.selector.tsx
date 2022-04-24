import { createSelector } from "reselect";

// redux store
import { RootState } from "..";

export const getChanels = (state: RootState) => state.chanels;

export const isLoading = createSelector([getChanels], (chanels) => chanels.isLoading);

export const getSelectedChanelId = createSelector([getChanels], (chanels) => chanels.selectedId);
export const getChanelList = createSelector([getChanels], (chanels) => chanels.list);
export const getDirectMessagesList = createSelector(
  [getChanels],
  (chanels) => chanels.directMessages
);
