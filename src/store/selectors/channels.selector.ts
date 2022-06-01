import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

const getChannels = (state: RootState) => state.channels;

const isLoading = createSelector([getChannels], (channels) => channels.isLoading);
const getChannelList = createSelector([getChannels], (channels) => channels.list);
const getDirectMessagesList = createSelector([getChannels], (channels) => channels.directMessages);

const getSelectedChannelId = createSelector([getChannels], (channels) => channels.selectedId);

const getSelectedChannel = createSelector(
  [getChannelList, getDirectMessagesList, getSelectedChannelId],
  (channels, directMessages, selectedId) => {
    const selected = channels.find((channel) => channel.id === selectedId);
    if (selected) return selected;
    return directMessages.find((channel) => channel.id === selectedId);
  }
);

const getUnreadMessageCount = createSelector(
  [getSelectedChannel],
  (channel) => channel?.unreadMessageCount || 0
);

const channelsSelectors = {
  isLoading,
  getChannelList,
  getDirectMessagesList,
  getSelectedChannelId,
  getSelectedChannel,
  getUnreadMessageCount,
};

export default channelsSelectors;
