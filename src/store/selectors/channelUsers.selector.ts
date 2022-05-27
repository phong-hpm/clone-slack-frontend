import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

export const getChannelUsersState = (state: RootState) => state.channelUsers;

export const getChannelUserList = createSelector([getChannelUsersState], (users) => users.list);
export const getChannelUserById = (id: string) => {
  return createSelector([getChannelUserList], (channelUserList) =>
    channelUserList.find((user) => user.id === id)
  );
};
