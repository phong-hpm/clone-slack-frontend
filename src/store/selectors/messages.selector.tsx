import { createSelector } from "reselect";

// redux store
import { RootState } from "..";

// redux selectors
import * as usersSelector from "./users.selector";

// utils
import { dayFormat, isToday, minuteDiff } from "utils/dayjs";

// types
import { UserType, MessageType } from "store/slices/_types";

export const getMessages = (state: RootState) => state.messages;

export const isLoading = createSelector([getMessages], (messages) => messages.isLoading);

const getList = createSelector([getMessages], (messages) => messages.list);

export const getMessageList = createSelector([getList], (list) =>
  [...list].sort((a, b) => a.created - b.created)
);

interface UserMessageType {
  userOwner?: UserType;
  message: MessageType;
}

export const getGroupedMessageList = createSelector(
  [getMessageList, usersSelector.getUserList],
  (list, userList) => {
    if (!list.length) return [];

    const messageList = [...list].sort((a, b) => a.created - b.created);

    const dayGroups: { day: string; minuteGroups: UserMessageType[] }[] = [];

    const minuteGroups: UserMessageType[] = [];
    let previousUserId = "";
    let previousCreated = 0;

    // If update these codes, we MUST NOT to create new message's reference
    // if message's references are changed, all [MessageContent] component will be re-render
    //       after [messageList] was changed, althought message's data were not changed
    for (let i = 0; i < messageList.length; i++) {
      const curMinuteGroup: UserMessageType = { message: messageList[i] };
      const { user: userId, created } = messageList[i];

      // add group if message was created after previous message over 5 minutes
      if (userId !== previousUserId || minuteDiff(created, previousCreated) > 5) {
        curMinuteGroup.userOwner = userList.find((user) => userId === user.id);
      }
      minuteGroups.push(curMinuteGroup);
      previousUserId = userId;
      previousCreated = created;

      // created to day string
      const createdDay = isToday(created) ? "today" : dayFormat(created, "dddd, MMM Do");
      // check if not same day
      if (dayGroups[dayGroups.length - 1]?.day !== createdDay) {
        dayGroups.push({ day: createdDay, minuteGroups: [] });
      }

      // add minute group to current day group
      dayGroups[dayGroups.length - 1].minuteGroups.push(curMinuteGroup);
    }

    return dayGroups;
  }
);
