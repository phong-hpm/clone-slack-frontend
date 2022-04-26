import { createSelector } from "reselect";

// redux store
import { RootState } from "..";

export const getChannels = (state: RootState) => state.channels;

export const isLoading = createSelector([getChannels], (channels) => channels.isLoading);

export const getSelectedChannelId = createSelector(
  [getChannels],
  (channels) => channels.selectedId
);
export const getChannelList = createSelector([getChannels], (channels) => channels.list);
export const getDirectMessagesList = createSelector(
  [getChannels],
  (channels) => channels.directMessages
);
