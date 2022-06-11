// types
import { RootState } from "store/_types";

const messagesSelectors = {
  isLoading: (state: RootState) => state.messages.isLoading,
  hasMore: (state: RootState) => state.messages.hasMore,
  getMessageList: (state: RootState) => state.messages.list,
  getDayMessageList: (state: RootState) => state.messages.dayMessageList,
};
export default messagesSelectors;
