import { createSelector } from "@reduxjs/toolkit";

// types
import { RootState } from "store/_types";

const getChannelUserList = (state: RootState) => state.channelUsers.list;
const getChannelUserById = createSelector(
  [getChannelUserList, (_, id: string) => id],
  (userList, id) => userList.find((user) => user.id === id)
);

const channelUsersSelectors = {
  getChannelUserList,
  getChannelUserById,
};
export default channelUsersSelectors;
