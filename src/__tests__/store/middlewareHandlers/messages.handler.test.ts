// store
import { setupStore } from "store";

// redux slices
import { setTeamUserList } from "store/slices/teamUsers.slice";
import {
  addMessage,
  pushMoreMessagesList,
  removeMessage,
  setMessagesList,
} from "store/slices/messages.slice";

// utils
import { mapDayMessageList, removeDayMessage } from "utils/message";

// types
import { Delta } from "quill";
import { MessageType, UserType } from "store/slices/_types";

let store = setupStore();

const userData: UserType = {
  id: "U-o29OsxUsn",
  name: "Phong Ho",
  realname: "Phong Ho Pham Minh",
  email: "phonghophamminh@gmail.com",
  timeZone: "",
  avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
};

const message_1: MessageType = {
  id: "message_1",
  type: "message",
  delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
  user: "U-o29OsxUsn",
  team: "T-Z4ijiEVH4",
  reactions: {},
  files: [],
  createdTime: 1651942800008,
  updatedTime: 1651942800008,
};
const message_2: MessageType = {
  id: "message_2",
  type: "message",
  delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
  user: "U-o29OsxUsn",
  team: "T-Z4ijiEVH4",
  reactions: {},
  files: [],
  createdTime: 1651942800009,
  updatedTime: 1651942800009,
};

beforeEach(() => {
  store = setupStore();
});

describe("disptach setDayMessageList automaticaly", () => {
  test("When setMessagesList, setTeamUserList were dispatched", () => {
    expect(store.getState().messages.dayMessageList).toEqual([]);

    // set team users
    store.dispatch(setTeamUserList([userData]));
    // set messages
    store.dispatch(setMessagesList({ hasMore: false, messages: [message_1, message_2] }));

    expect(store.getState().messages.dayMessageList).toEqual(
      mapDayMessageList(store.getState().messages.list, store.getState().teamUsers.list)
    );
  });

  test("When pushMoreMessagesList was dispatched", () => {
    store.dispatch(setTeamUserList([userData]));

    expect(store.getState().messages.dayMessageList).toEqual([]);

    // set more messages
    store.dispatch(pushMoreMessagesList({ hasMore: false, messages: [message_1, message_2] }));

    expect(store.getState().messages.dayMessageList).toEqual(
      mapDayMessageList(store.getState().messages.list, store.getState().teamUsers.list)
    );
  });

  test("When addMessage or removeMessage was dispatched", () => {
    store.dispatch(setTeamUserList([userData]));

    expect(store.getState().messages.dayMessageList).toEqual([]);

    // add new message
    store.dispatch(addMessage(message_1));

    expect(store.getState().messages.dayMessageList).toEqual(
      mapDayMessageList(store.getState().messages.list, store.getState().teamUsers.list)
    );

    // remove message but id is undefined
    store.dispatch(removeMessage(undefined as unknown as string));

    expect(store.getState().messages.dayMessageList).toEqual(
      mapDayMessageList(store.getState().messages.list, store.getState().teamUsers.list)
    );

    // remove message
    store.dispatch(removeMessage(message_1.id));

    expect(store.getState().messages.dayMessageList).toEqual(
      removeDayMessage(store.getState().messages.dayMessageList, message_1.id)
    );
  });
});
