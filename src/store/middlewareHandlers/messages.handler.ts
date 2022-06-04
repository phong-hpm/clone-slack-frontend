// redux slices
import { setChannelUserList } from "store/slices/channelUsers.slice";
import {
  addMessage,
  removeMessage,
  setDayMessageList,
  setMessagesList,
} from "store/slices/messages.slice";

// redux selectors
import channelUsersSelectors from "store/selectors/channelUsers.selector";
import messagesSelectors from "store/selectors/messages.selector";

// utils
import { mapDayMessageList, pushDayMessage, removeDayMessage } from "utils/message";

// types
import { WatcherType } from "store/_types";

const messagesHandlers = (watcher: WatcherType) => {
  // map [dayMessageList] when call [setMessagesList]
  watcher(
    (state, dispatch) => {
      let channelUserList = channelUsersSelectors.getChannelUserList(state);
      let messageList = messagesSelectors.getMessageList(state);

      if (!messageList.length) {
        dispatch(setDayMessageList([]));
      }

      if (messageList.length && channelUserList.length) {
        const dayMessageList = mapDayMessageList(messageList, channelUserList);
        dispatch(setDayMessageList(dayMessageList));
      }
    },
    // callback will be fired when user call these actions
    [setMessagesList, setChannelUserList]
  );

  // push [dayMessageList] when call [addMessage]
  watcher(
    (state, dispatch, action: ReturnType<typeof addMessage>) => {
      let channelUserList = channelUsersSelectors.getChannelUserList(state);
      let dayMessageList = messagesSelectors.getDayMessageList(state);

      // all messages and days in [...messageList] will be keeped references
      // we can't use [mapDayMessageList] because [dayMessageList] can be very large
      const updatedDayMessageList = pushDayMessage(
        [...dayMessageList],
        channelUserList,
        action.payload
      );
      dispatch(setDayMessageList(updatedDayMessageList));
    },
    // callback will be fired when user call these actions
    [addMessage]
  );

  // push [dayMessageList] when call [removeMessage]
  watcher(
    (state, dispatch, action: ReturnType<typeof removeMessage>) => {
      if (!action.payload) return;

      let dayMessageList = messagesSelectors.getDayMessageList(state);

      // all messages and day in [...messageList] will be keeped references
      const updatedDayMessageList = removeDayMessage([...dayMessageList], action.payload);
      dispatch(setDayMessageList(updatedDayMessageList));
      console.log(updatedDayMessageList);
    },
    // callback will be fired when user call these actions
    [removeMessage]
  );
};

export default messagesHandlers;
