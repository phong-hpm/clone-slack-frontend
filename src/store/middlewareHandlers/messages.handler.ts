// redux slices
import {
  addMessage,
  pushMoreMessagesList,
  removeMessage,
  setDayMessageList,
  setMessagesList,
} from "store/slices/messages.slice";

// redux selectors
import teamUsersSelectors from "store/selectors/teamUsers.selector";
import channelUsersSelectors from "store/selectors/channelUsers.selector";
import messagesSelectors from "store/selectors/messages.selector";

// utils
import { mapDayMessageList, pushDayMessage, removeDayMessage } from "utils/message";

// types

// types
import { WatcherType } from "store/_types";
import { setTeamUserList } from "store/slices/teamUsers.slice";

const firedMap = new Map<string, any>();
const messagesHandlers = (watcher: WatcherType) => {
  // map [dayMessageList] when call [setMessagesList]
  // because [channelSocket] and [messageSocket] were running asynchronous
  //  we have to listen both of [setMessagesList] and [setChannelUserList]
  watcher(
    (state, dispatch, action: ReturnType<typeof setMessagesList>) => {
      let teamUserList = teamUsersSelectors.getTeamUserList(state);
      let messageList = messagesSelectors.getMessageList(state);

      // firedMap will help checking are [channelSocket] and [messageSocket] were dispatched
      firedMap.set(action.type, action.payload);
      if (firedMap.size === 2) {
        const hasMore: boolean = firedMap.get(setMessagesList.type).hasMore;
        const dayMessages = mapDayMessageList(messageList, teamUserList);
        dispatch(setDayMessageList({ hasMore, dayMessages }));
      }
    },
    // callback will be fired when user call these actions
    [setMessagesList, setTeamUserList]
  );

  // map [dayMessageList] when call [pushMoreMessagesList]
  watcher(
    (state, dispatch, action: ReturnType<typeof pushMoreMessagesList>) => {
      let channelUserList = channelUsersSelectors.getChannelUserList(state);
      let messageList = messagesSelectors.getMessageList(state);

      if (!channelUserList || !messageList) return;

      if (messageList.length && channelUserList.length) {
        const hasMore = action.payload.hasMore;
        const dayMessages = mapDayMessageList(messageList, channelUserList);
        dispatch(setDayMessageList({ hasMore, dayMessages }));
      }
    },
    // callback will be fired when user call these actions
    [pushMoreMessagesList]
  );

  // push [dayMessageList] when call [addMessage]
  watcher(
    (state, dispatch, action: ReturnType<typeof addMessage>) => {
      let channelUserList = channelUsersSelectors.getChannelUserList(state);
      let dayMessageList = messagesSelectors.getDayMessageList(state);

      // all messages and days in [...messageList] will be keeped references
      // we can't use [mapDayMessageList] because [dayMessageList] can be very large
      const dayMessages = pushDayMessage([...dayMessageList], channelUserList, action.payload);
      dispatch(setDayMessageList({ dayMessages }));
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
      const dayMessages = removeDayMessage([...dayMessageList], action.payload);
      dispatch(setDayMessageList({ dayMessages }));
    },
    // callback will be fired when user call these actions
    [removeMessage]
  );
};

export default messagesHandlers;
