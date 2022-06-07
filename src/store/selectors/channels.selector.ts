import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

const getChannels = (state: RootState) => state.channels;

const isLoading = createSelector([getChannels], (channels) => channels.isLoading);
const getChannelList = createSelector([getChannels], (channels) => channels.list);

const getSelectedChannelId = createSelector([getChannels], (channels) => channels.selectedId);

const getSelectedChannel = createSelector(
  [getChannelList, getSelectedChannelId],
  (channels, selectedId) => channels.find((channel) => channel.id === selectedId)
);

const getUnreadMessageCount = createSelector(
  [getSelectedChannel],
  (channel) => channel?.unreadMessageCount || 0
);

const channelsSelectors = {
  isLoading,
  getChannelList,
  getSelectedChannelId,
  getSelectedChannel,
  getUnreadMessageCount,
};

export default channelsSelectors;
