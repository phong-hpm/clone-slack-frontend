import { createSelector } from "reselect";

// types
import { RootState } from "store/_types";

const getMessages = (state: RootState) => state.messages;

const isLoading = createSelector([getMessages], (messages) => messages.isLoading);

const getList = createSelector([getMessages], (messages) => messages.list);

const getMessageList = createSelector([getList], (list) =>
  [...list].sort((a, b) => a.createdTime - b.createdTime)
);

const hasMore = createSelector([getMessages], (messages) => messages.hasMore);
const getDayMessageList = createSelector([getMessages], (messages) => messages.dayMessageList);

const getDayMessageByIndex = (index: number) =>
  createSelector([getMessages], (messages) => messages.dayMessageList[index]);

const messagesSelectors = {
  isLoading,
  getList,
  getMessageList,
  getDayMessageList,
  hasMore,
  getDayMessageByIndex,
};

export default messagesSelectors;
