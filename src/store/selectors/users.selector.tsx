import { createSelector } from "reselect";

import { RootState } from "..";

export const getUsers = (state: RootState) => state.users;

export const getUserList = createSelector([getUsers], (users) => users.list);
