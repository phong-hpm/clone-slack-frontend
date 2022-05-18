import { createSelector } from "reselect";

// redux store
import { RootState } from "..";

export const getUsers = (state: RootState) => state.users;

export const getUserList = createSelector([getUsers], (users) => users.list);
export const getUserById = (id: string) =>
  createSelector([getUserList], (userList) => userList.find((user) => user.id === id));
