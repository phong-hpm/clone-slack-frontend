import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

const getChannelUsersState = (state: RootState) => state.channelUsers;

const getChannelUserList = createSelector([getChannelUsersState], (users) => users.list);
const getChannelUserById = (id: string) => {
  return createSelector([getChannelUserList], (channelUserList) =>
    channelUserList.find((user) => user.id === id)
  );
};

const channelUsersSelectors = { getChannelUserList, getChannelUserById };

export default channelUsersSelectors;
