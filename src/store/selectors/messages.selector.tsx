import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

export const getMessages = (state: RootState) => state.messages;

export const isLoading = createSelector([getMessages], (messages) => messages.isLoading);

const getList = createSelector([getMessages], (messages) => messages.list);

export const getMessageList = createSelector([getList], (list) =>
  [...list].sort((a, b) => a.createdTime - b.createdTime)
);

export const getDayMessageList = createSelector(
  [getMessages],
  (messages) => messages.dayMessageList
);

export const getDayMessageByIndex = (index: number) =>
  createSelector([getMessages], (messages) => messages.dayMessageList[index]);

export const getDayMessageListLength = createSelector(
  [getMessages],
  (messages) => messages.dayMessageList.length
);
