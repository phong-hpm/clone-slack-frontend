import { createSelector } from "@reduxjs/toolkit";

// types
import { RootState } from "store/_types";

const getChannelList = (state: RootState) => state.channels.list;
const getSelectedChannelId = (state: RootState) => state.channels.selectedId;

const getSelectedChannel = createSelector(
  [getChannelList, getSelectedChannelId],
  (channels, selectedId) => channels.find((channel) => channel.id === selectedId)
);
const getUnreadMessageCount = createSelector(
  [getSelectedChannel],
  (channel) => channel?.unreadMessageCount || 0
);

const channelsSelectors = {
  isLoading: (state: RootState) => state.channels.isLoading,
  getChannelList,
  getSelectedChannelId,
  getSelectedChannel,
  getUnreadMessageCount,
};
export default channelsSelectors;
