import { createSelector } from "reselect";

// redux store
import { RootState } from "..";

export const getMessages = (state: RootState) => state.messages;

export const isLoading = createSelector([getMessages], (messages) => messages.isLoading);

const getList = createSelector([getMessages], (messages) => messages.list);

export const getMessageList = createSelector([getList], (list) =>
  [...list].sort((a, b) => a.created - b.created)
);
