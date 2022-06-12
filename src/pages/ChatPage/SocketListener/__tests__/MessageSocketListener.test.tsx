import mockIO from "socket.io-client";

// redux slices
import { setIsAuth } from "store/slices/user.slice";
import { setSelectedTeamId } from "store/slices/teams.slice";
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";

// components
import MessageSocketListener from "../MessageSocketListener";

// utils
import cacheUtils from "utils/cacheUtils";
import { customRender, store } from "tests";
import { SocketEvent, SocketEventDefault } from "utils/constants";

// types
import { ChannelType, MessageType } from "store/slices/_types";
import { Delta } from "quill";
import { setDayMessageList, setMessagesList } from "store/slices/messages.slice";

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

const publicChannel: ChannelType = {
  id: "C-111111",
  type: "public_channel",
  name: "general",
  users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  unreadMessageCount: 79,
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

const socket = mockIO();

const spyListener = (name: string, data?: any) => {
  (socket.on as jest.Mock).mockImplementation((eventName: string, cb: Function) => {
    if (eventName === name) cb(data);
    return socket;
  });
};

beforeEach(() => {
  store.dispatch(setIsAuth(true));
  store.dispatch(setSelectedTeamId("T-111111"));
  store.dispatch(setSelectedChannelId("C-111111"));
  store.dispatch(setChannelsList([]));
  (socket.on as jest.Mock).mockImplementation(() => socket);
});

describe("Test render", () => {
  test("When no channel was selected", () => {
    store.dispatch(setSelectedChannelId(""));

    customRender(<MessageSocketListener />);

    expect(socket.on).not.toBeCalled();
  });

  test("When a team was selected", () => {
    customRender(<MessageSocketListener />);

    expect(socket.on).toBeCalledWith(SocketEventDefault.CONNECT, expect.any(Function));
  });

  test("when socket connected", () => {
    spyListener(SocketEventDefault.CONNECT);

    customRender(<MessageSocketListener />);
    expect(socket.emit).toBeCalledWith(SocketEvent.EMIT_LOAD_MESSAGES, { data: { limit: 20 } });
  });

  test("when socket connected and load cache", () => {
    jest.spyOn(cacheUtils, "isSameUpdatedTime").mockImplementation(() => true);
    jest
      .spyOn(cacheUtils, "getCachedMessages")
      .mockImplementation(() => ({
        channelId: "",
        hasMore: false,
        messages: [message_1, message_2],
      }));
    spyListener(SocketEventDefault.CONNECT);

    customRender(<MessageSocketListener />);
    expect(socket.emit).not.toBeCalled();
    expect(store.getState().messages.list).toEqual([message_1, message_2]);
  });
});

describe("Test redux store", () => {
  test("when server return messages list", () => {
    const data = { channelId: publicChannel.id, messages: [message_1], updatedTime: 1000 };
    spyListener(SocketEvent.ON_MESSAGES, data);
    store.dispatch(setMessagesList({ hasMore: false, messages: [] }));

    customRender(<MessageSocketListener />);

    // expect store
    expect(store.getState().messages.list).toEqual([message_1]);
  });

  test("when server return more messages", () => {
    const data = {
      channelId: publicChannel.id,
      hasMore: false,
      messages: [message_2],
      updatedTime: 1000,
    };
    spyListener(SocketEvent.ON_MORE_MESSAGES, data);
    store.dispatch(setMessagesList({ hasMore: true, messages: [message_1] }));

    customRender(<MessageSocketListener />);

    // expect store
    expect(store.getState().messages.list).toEqual([message_2, message_1]);
  });

  test("when server return removed messages", () => {
    const data = { channelID: publicChannel.id, messageId: message_2.id, updatedTime: 1000 };
    spyListener(SocketEvent.ON_REMOVED_MESSAGE, data);
    store.dispatch(setMessagesList({ hasMore: true, messages: [message_1, message_2] }));

    customRender(<MessageSocketListener />);

    // expect store
    expect(store.getState().messages.list).toEqual([message_1]);
  });

  test("when server return edited messages", () => {
    const data = {
      channelId: publicChannel.id,
      message: { ...message_1, team: "T-12345678" },
      updatedTime: 1000,
    };
    spyListener(SocketEvent.ON_EDITED_MESSAGE, data);
    store.dispatch(setMessagesList({ hasMore: true, messages: [{ ...message_1, team: "" }] }));

    customRender(<MessageSocketListener />);

    // expect store
    expect(store.getState().messages.list).toEqual([{ ...message_1, team: "T-12345678" }]);
  });

  test("when server return shared message to channel", () => {
    const data = { toChannelId: publicChannel.id, message: message_2, updatedTime: 1000 };
    spyListener(SocketEvent.ON_SHARE_MESSAGE_TO_CHANNEL, data);
    store.dispatch(setSelectedChannelId("C-old-id"));

    customRender(<MessageSocketListener />);

    // expect store
    expect(store.getState().channels.selectedId).toEqual(publicChannel.id);
  });

  test("when server return added message", () => {
    const data = { channelId: publicChannel.id, message: message_1, updatedTime: 1000 };
    spyListener(SocketEvent.ON_ADDED_MESSAGE, data);
    store.dispatch(setMessagesList({ hasMore: true, messages: [] }));

    customRender(<MessageSocketListener />);

    // expect store
    expect(store.getState().messages.list).toEqual([message_1]);
  });
});
