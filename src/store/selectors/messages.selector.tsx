import { createSelector } from "reselect";

// redux store
import { RootState } from "..";

export const getMessages = (state: RootState) => state.messages;

export const isLoading = createSelector([getMessages], (messages) => messages.isLoading);

export const getMessageList = createSelector([getMessages], (messages) => messages.list);
