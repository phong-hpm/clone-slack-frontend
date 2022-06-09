import { Delta } from "quill";

// utils
import * as dayjs from "utils/dayjs";
import { notifyMentions } from "utils/constants";
import {
  updateEditableLinkField,
  addNecessaryFields,
  removeUnnecessaryFields,
  removeDayMessage,
  pushDayMessage,
  mapDayMessageList,
} from "utils/message";

// types
import { DayMessageType } from "store/slices/_types";

const userData = {
  id: "U-o29OsxUsn",
  name: "Phong Ho",
  realname: "Phong Ho Pham Minh",
  email: "phonghophamminh@gmail.com",
  timeZone: "",
  teams: [],
  avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
  createdTime: 1653589513216,
  updatedTime: 1653589513216,
};

const notifyMention = Object.values(notifyMentions)[0];

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Update delta", () => {
  const dataCut = {
    textOperation: { insert: "add link " },
    mentionOperation: { insert: { mention: { id: userData.id } } },
    notifyMentionOperation: { insert: { mention: { id: notifyMention.id } } },
    linkOperation: {
      attributes: { link: { text: "new link", href: "google.com" } },
    },
  };

  const dataFull = {
    textOperation: { insert: "add link " },
    mentionOperation: {
      insert: {
        mention: {
          id: userData.id,
          denotationChar: "@",
          name: userData.name,
          email: userData.email,
          realname: userData.realname,
          value: userData.name,
          isHighlight: true,
          isNotify: false,
        },
      },
    },
    notifyMentionOperation: {
      insert: {
        mention: {
          ...notifyMention,
          denotationChar: "@",
          value: notifyMention.name,
          isHighlight: true,
          isNotify: true,
          timeZone: undefined,
        },
      },
    },
    linkOperation: {
      attributes: { link: { text: "new link", href: "google.com", isEditable: true } },
    },
  };

  const wrongMentionOperation = { insert: { mention: { id: "not-existed" } } };

  test("updateEditableLinkField", () => {
    const newDelta = updateEditableLinkField(
      { ops: [dataCut.textOperation, dataCut.linkOperation] } as unknown as Delta,
      true
    );

    expect(newDelta).toEqual({ ops: [dataFull.textOperation, dataFull.linkOperation] });
  });

  test("addNecessaryFields", () => {
    const newDelta = addNecessaryFields(
      {
        ops: [
          wrongMentionOperation,
          dataCut.textOperation,
          dataCut.mentionOperation,
          dataCut.notifyMentionOperation,
        ],
      } as unknown as Delta,
      [userData],
      userData.id
    );

    expect(newDelta).toEqual({
      ops: [
        wrongMentionOperation,
        dataFull.textOperation,
        dataFull.mentionOperation,
        dataFull.notifyMentionOperation,
      ],
    });
  });

  test("removeUnnecessaryFields", () => {
    const newDelta = removeUnnecessaryFields({
      ops: [dataFull.textOperation, dataFull.linkOperation, dataFull.mentionOperation],
    } as unknown as Delta);

    expect(newDelta).toEqual({
      ops: [dataCut.textOperation, dataCut.linkOperation, dataCut.mentionOperation],
    });
  });
});

describe("Update day messages", () => {
  const messageData = {
    day_1: { day: "Tuesday, Feb 1st" },
    day_2: { day: "Saturday, May 7th" },
    message_1: {
      id: "message_1",
      type: "message",
      delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
      user: "U-o29OsxUsn",
      team: "T-Z4ijiEVH4",
      reactions: {},
      files: [],
      createdTime: 1651942800008,
      updatedTime: 1651942800008,
    },
    message_2: {
      id: "message_2",
      type: "message",
      delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
      user: "U-o29OsxUsn",
      team: "T-Z4ijiEVH4",
      reactions: {},
      files: [],
      createdTime: 1651942800009,
      updatedTime: 1651942800009,
    },
    message_3: {
      id: "message_2",
      type: "message",
      delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
      user: "U-o29OsxUsn",
      team: "T-Z4ijiEVH4",
      reactions: {},
      files: [],
      createdTime: Date.now(),
      updatedTime: Date.now(),
    },
    userOwner_1: {
      id: "userOwner_1",
      name: "Phong Ho",
      realname: "Phong Hồ",
      email: "phonghophamminh@gmail.com",
      timeZone: "",
      avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
      isOnline: true,
    },
    userOwner_2: {
      id: "userOwner_2",
      name: "Phong Ho",
      realname: "Phong Hồ",
      email: "phonghophamminh@gmail.com",
      timeZone: "",
      avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
      isOnline: true,
    },
  };

  describe("mapDayMessageList", () => {
    test("When messages were created today", () => {
      const data = mapDayMessageList(
        [messageData.message_1, messageData.message_2, messageData.message_3],
        [userData]
      );

      expect(data).toEqual([
        { day: "Sunday, May 8th" },
        { message: messageData.message_1, userOwner: userData },
        { message: messageData.message_2 },
        { day: "today" },
        { message: messageData.message_3, userOwner: userData },
      ]);
    });
  });

  describe("pushDayMessage", () => {
    test("When new message was created today", () => {
      jest.spyOn(dayjs, "isToday").mockImplementation(() => true);
      pushDayMessage([], [userData], messageData.message_2);
    });

    test("When new message was NOT created today", () => {
      jest.spyOn(dayjs, "isToday").mockImplementation(() => false);
      pushDayMessage([], [userData], messageData.message_2);
    });

    test("When new message has same createdTime with last message", () => {
      pushDayMessage([{ message: messageData.message_1 }], [userData], messageData.message_2);
    });
  });

  describe("removeDayMessage", () => {
    test("when id is not exist in list", () => {
      const newData = removeDayMessage(
        [messageData.day_1, { message: messageData.message_1 }] as unknown as DayMessageType[],
        "wrong id"
      );

      expect(newData).toEqual([messageData.day_1, { message: messageData.message_1 }]);
    });

    test("When removing message doesn't have owner", () => {
      const newData = removeDayMessage(
        [
          messageData.day_1,
          { message: messageData.message_1, userOwner: messageData.userOwner_1 },
          { message: messageData.message_2 },
        ] as unknown as DayMessageType[],
        messageData.message_2!.id
      );

      expect(newData).toEqual([
        messageData.day_1,
        { message: messageData.message_1, userOwner: messageData.userOwner_1 },
      ]);
    });

    test("When removing message and next message are owned by 1 user", () => {
      const newData = removeDayMessage(
        [
          messageData.day_1,
          { message: messageData.message_1, userOwner: messageData.userOwner_1 },
          { message: messageData.message_2 },
        ] as unknown as DayMessageType[],
        messageData.message_1!.id
      );

      expect(newData).toEqual([
        messageData.day_1,
        { message: messageData.message_2, userOwner: messageData.userOwner_1 },
      ]);
    });

    test("When removing message and next message are owned by 2 users", () => {
      const newData = removeDayMessage(
        [
          messageData.day_1,
          { message: messageData.message_1, userOwner: messageData.userOwner_1 },
          { message: messageData.message_2, userOwner: messageData.userOwner_2 },
        ] as unknown as DayMessageType[],
        messageData.message_1!.id
      );

      expect(newData).toEqual([
        messageData.day_1,
        { message: messageData.message_2, userOwner: messageData.userOwner_2 },
      ]);
    });

    test("When before and after removing message are days", () => {
      const newData = removeDayMessage(
        [
          messageData.day_1,
          { message: messageData.message_1, userOwner: messageData.userOwner_1 },
          messageData.day_2,
        ] as unknown as DayMessageType[],
        messageData.message_1!.id
      );

      expect(newData).toEqual([messageData.day_2]);
    });
  });
});
