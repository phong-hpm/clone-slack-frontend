// redux slices
import { setUserList } from "store/slices/users.slice";
import {
  addMessage,
  removeMessage,
  setDayMessageList,
  setMessagesList,
} from "store/slices/messages.slice";

// redux selectors
import { getUserList } from "store/selectors/users.selector";
import { getDayMessageList, getMessageList } from "store/selectors/messages.selector";

// utils
import { mapDayMessageList, pushDayMessage, removeDayMessage } from "utils/message";

// types
import { WatcherType } from "store/_types";

const messagesHandlers = (watcher: WatcherType) => {
  // map [dayMessageList] when call [setMessagesList]
  watcher(
    (state, dispatch) => {
      let userList = getUserList(state);
      let messageList = getMessageList(state);

      console.log(userList.length, messageList.length);

      if (messageList.length && userList.length) {
        const dayMessageList = mapDayMessageList(messageList, userList);
        dispatch(setDayMessageList(dayMessageList));
      }
    },
    // callback will be fired when user call these actions
    [setMessagesList, setUserList]
  );

  // push [dayMessageList] when call [addMessage]
  watcher(
    (state, dispatch, action: ReturnType<typeof addMessage>) => {
      let userList = getUserList(state);
      let dayMessageList = getDayMessageList(state);

      // all messages and day in [...messageList] will be keeped references
      // we can't use [mapDayMessageList] because [dayMessageList] can be very large
      const updatedDayMessageList = pushDayMessage([...dayMessageList], userList, action.payload);
      dispatch(setDayMessageList(updatedDayMessageList));
    },
    // callback will be fired when user call these actions
    [addMessage]
  );

  // push [dayMessageList] when call [removeMessage]
  watcher(
    (state, dispatch, action: ReturnType<typeof removeMessage>) => {
      if (!action.payload) return;

      let dayMessageList = getDayMessageList(state);

      console.log(dayMessageList);

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
