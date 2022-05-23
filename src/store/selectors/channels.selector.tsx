import { createSelector } from "reselect";

// redux store
import { RootState } from "..";

export const getChannels = (state: RootState) => state.channels;

export const isLoading = createSelector([getChannels], (channels) => channels.isLoading);
export const getChannelList = createSelector([getChannels], (channels) => channels.list);
export const getDirectMessagesList = createSelector(
  [getChannels],
  (channels) => channels.directMessages
);

export const getSelectedChannelId = createSelector(
  [getChannels],
  (channels) => channels.selectedId
);

export const getSelectedChannel = createSelector(
  [getChannelList, getDirectMessagesList, getSelectedChannelId],
  (channels, directMessages, selectedId) => {
    const selected = channels.find((channel) => channel.id === selectedId);
    if (selected) return selected;
    return directMessages.find((channel) => channel.id === selectedId);
  }
);

export const getUnreadMessageCount = createSelector(
  [getSelectedChannel],
  (channel) => channel?.unreadMessageCount || 0
);
