// store
import { setupStore } from "store";

// redux slices
import { setTeamUserList } from "store/slices/teamUsers.slice";
import { setMessagesList } from "store/slices/messages.slice";

// redux selectors
import messagesSelectors from "store/selectors/messages.selector";

// utils
import { mapDayMessageList } from "utils/message";

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
  store.dispatch(setTeamUserList([userData]));
  store.dispatch(setMessagesList({ hasMore: true, messages: [message_1, message_2] }));
});

describe("Test messagesSelectors", () => {
  test("Test isLoading", () => {
    const data = messagesSelectors.isLoading(store.getState());
    expect(data).toBeFalsy();
  });

  test("Test hasMore", () => {
    const data = messagesSelectors.hasMore(store.getState());
    expect(data).toBeTruthy();
  });

  test("Test getMessageList", () => {
    const data = messagesSelectors.getMessageList(store.getState());
    expect(data).toEqual([message_1, message_2]);
  });

  test("Test getDayMessageList", () => {
    const data = messagesSelectors.getDayMessageList(store.getState());
    expect(data).toEqual(mapDayMessageList([message_1, message_2], [userData]));
  });
});
