import { Delta } from "quill";
import { ContextLinkValueType } from "pages/ChatPage/Conversation/ChatBox/MessageInput/_types";

// utils
import { dayFormat, isToday, minuteDiffAbs } from "utils/dayjs";
import { notifyMentions } from "./constants";

// types
import { DayMessageType, MessageType, UserType } from "store/slices/_types";

export const updateEditableLinkField = (delta: Delta, isEditable: boolean) => {
  const ops = delta.ops?.map((op) => {
    // link operation
    if (op.attributes?.link) {
      const { text, href } = op.attributes.link;
      return {
        ...op,
        attributes: {
          ...op.attributes,
          link: { text, href, isEditable },
        },
      };
    }

    return op;
  });

  return { ...delta, ops } as Delta;
};

export const addNecessaryFields = (delta: Delta, channelUserList: UserType[], id: string) => {
  const ops = delta.ops?.map((op) => {
    // mention operation
    if (op?.insert?.mention?.id) {
      const mentionId = op?.insert?.mention.id || "";

      let user: UserType | undefined;
      if (notifyMentions[mentionId]) user = notifyMentions[mentionId];
      else user = channelUserList.find((usr) => usr.id === mentionId);

      if (!user) return op;
      return {
        ...op,
        insert: {
          ...op.insert,
          mention: {
            ...op.insert.mention,
            denotationChar: "@",
            name: user.name,
            email: user.email,
            realname: user.realname,
            value: user.name,
            isHighlight: !!notifyMentions[mentionId] || mentionId === id,
            isNotify: !!notifyMentions[mentionId],
          },
        },
      };
    }

    return op;
  });

  return { ...delta, ops } as Delta;
};

export const removeUnnecessaryFields = (delta: Delta) => {
  // remove empty line from start and end of ops;
  let ops: Delta["ops"] = [];

  // remove un-use fields
  ops = delta.ops?.map((op) => {
    // link operation
    if (op.attributes?.link) {
      const { text, href } = op.attributes.link;
      return {
        ...op,
        attributes: {
          ...op.attributes,
          link: { text, href } as ContextLinkValueType,
        },
      };
    }

    // mention operation
    if (op?.insert?.mention) {
      return {
        ...op,
        insert: {
          ...op.insert,
          mention: { id: op.insert.mention.id },
        },
      };
    }

    return op;
  });

  return { ...delta, ops } as Delta;
};

export const mapDayMessageList = (messageList: MessageType[], teamUserList: UserType[]) => {
  let previousUserId = "";
  let previousCreatedTime = 0;
  let prevCreatedDay = "";
  const dayMessageList: DayMessageType[] = [];

  // If update these codes, we MUST NOT to create new message's reference
  // if message's references are changed, all [MessageContent] component will be re-render
  //       after [messageList] was changed, althought message's data were not changed
  for (let i = 0; i < messageList.length; i++) {
    const curDayMessage: DayMessageType = { message: messageList[i] };
    const { user: userId, createdTime } = messageList[i];

    // createdTime to day string
    const createdDay = isToday(createdTime) ? "today" : dayFormat(createdTime, "dddd, MMM Do");
    // check if not same day
    if (prevCreatedDay !== createdDay) {
      dayMessageList.push({ day: createdDay });
    }

    // add [userOwner] if:
    //  1: [message] was created after previous [message] over 5 minutes
    // [userOwner] will be used to render avatar of user
    if (userId !== previousUserId || minuteDiffAbs(createdTime, previousCreatedTime) > 5) {
      curDayMessage.userOwner = teamUserList.find((user) => userId === user.id);
    }
    dayMessageList.push(curDayMessage);

    previousUserId = userId;
    prevCreatedDay = createdDay;
    previousCreatedTime = createdTime;
  }

  return dayMessageList;
};

export const pushDayMessage = (
  dayMessageList: DayMessageType[],
  channelUserList: UserType[],
  message: MessageType
) => {
  const lastData = dayMessageList[dayMessageList.length - 1];

  let previousUserId = lastData?.message?.user || "";
  let previousCreatedTime = lastData?.message?.createdTime || 0;
  let prevCreatedDay = isToday(previousCreatedTime)
    ? "today"
    : dayFormat(previousCreatedTime, "dddd, MMM Do");

  const { user: userId, createdTime } = message;
  const curDayMessage: DayMessageType = { message };

  // createdTime to day string
  const createdDay = isToday(createdTime) ? "today" : dayFormat(createdTime, "dddd, MMM Do");
  // check if not same day
  if (prevCreatedDay !== createdDay) {
    dayMessageList.push({ day: createdDay });
  }

  // add [userOwner] if:
  //  1: [message] was created after previous [message] over 5 minutes
  // [userOwner] will be used to render avatar of user
  if (userId !== previousUserId || minuteDiffAbs(createdTime, previousCreatedTime) > 5) {
    curDayMessage.userOwner = channelUserList.find((user) => userId === user.id);
  }
  dayMessageList.push(curDayMessage);

  return dayMessageList;
};

export const removeDayMessage = (dayMessageList: DayMessageType[], messageId: string) => {
  const index = dayMessageList.findIndex((dayMessage) => dayMessage.message?.id === messageId);
  const removingIndex = [index];

  // messageId did not exist
  if (index < 0) return dayMessageList;
  const nextDayMessage = dayMessageList[index + 1];
  const dayMessage = dayMessageList[index];
  const prevDayMessage = dayMessageList[index - 1];

  // if removing user has [userOwner], try to move it to next message
  if (dayMessage.userOwner) {
    // if it is a message, not a day
    if (nextDayMessage?.message) {
      if (!nextDayMessage?.userOwner) {
        dayMessageList[index + 1] = { ...nextDayMessage, userOwner: dayMessage.userOwner };
      }
    }
  }

  // if previous item is a day and next item is a day too
  if (prevDayMessage?.day && nextDayMessage?.day) {
    // we will remove previous item
    removingIndex.push(index - 1);
  }

  dayMessageList = dayMessageList.filter((_, i) => !removingIndex.includes(i));

  return dayMessageList;
};
