import mockIO from "socket.io-client";

// redux slices
import { setIsAuth } from "store/slices/user.slice";
import { setSelectedTeamId } from "store/slices/teams.slice";
import { setChannelsList } from "store/slices/channels.slice";

// components
import ChannelSocketListener from "../ChannelSocketListener";

// utils
import { customRender, store } from "tests";
import { SocketEvent, SocketEventDefault } from "utils/constants";

// types
import { ChannelType } from "store/slices/_types";
import { setChannelUserList } from "store/slices/channelUsers.slice";

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
const directMessage: ChannelType = {
  id: "C-444444",
  type: "direct_message",
  name: "Direct message",
  users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  isStarred: true,
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
  store.dispatch(setChannelsList([]));
  (socket.on as jest.Mock).mockImplementation(() => socket);
});

describe("Test render", () => {
  test("When no team was selected", () => {
    store.dispatch(setSelectedTeamId(""));

    customRender(<ChannelSocketListener />);

    expect(socket.on).not.toBeCalled();
  });

  test("When a team was selected", () => {
    customRender(<ChannelSocketListener />);

    expect(socket.on).toBeCalledWith(SocketEventDefault.CONNECT, expect.any(Function));
  });

  test("when socket connected", () => {
    spyListener(SocketEventDefault.CONNECT);

    customRender(<ChannelSocketListener />);
    expect(socket.emit).toBeCalledWith(SocketEvent.EMIT_LOAD_CHANNELS);
  });
});

describe("Test redux store", () => {
  test("when server return channels list", () => {
    spyListener(SocketEvent.ON_CHANNELS, { channels: [publicChannel], users: [userData] });
    expect(store.getState().channels.list).toEqual([]);
    expect(store.getState().teamUsers.list).toEqual([]);

    customRender(<ChannelSocketListener />);

    // expect store
    expect(store.getState().channels.list).toEqual([publicChannel]);
    expect(store.getState().teamUsers.list).toEqual([userData]);
  });

  test("when server return a new channel", () => {
    spyListener(SocketEvent.ON_ADDED_CHANNEL, { channel: publicChannel });
    store.dispatch(setChannelsList([]));

    customRender(<ChannelSocketListener />);

    // expect store
    expect(store.getState().channels.list).toEqual([publicChannel]);
  });

  test("when server return updated channel", () => {
    spyListener(SocketEvent.ON_EDITED_CHANNEL, { channel: publicChannel });
    store.dispatch(setChannelsList([{ ...publicChannel, name: "old channel" }]));

    customRender(<ChannelSocketListener />);

    // expect store
    expect(store.getState().channels.list).toEqual([publicChannel]);
  });

  test("when server return removed channel", () => {
    spyListener(SocketEvent.ON_REMOVED_CHANNEL, { channelId: publicChannel.id });
    store.dispatch(setChannelsList([publicChannel, directMessage]));

    customRender(<ChannelSocketListener />);

    // expect store
    expect(store.getState().channels.list).toEqual([directMessage]);
  });

  test("when server return updated channel user list", () => {
    const data = { channelId: publicChannel.id, userId: userData.id, users: [userData] };
    spyListener(SocketEvent.ON_EDITED_CHANNEL_USERS, data);
    store.dispatch(setChannelUserList([]));

    customRender(<ChannelSocketListener />);

    // expect store
    expect(store.getState().channelUsers.list).toEqual([userData]);
  });

  test("when server return updated user online", () => {
    spyListener(SocketEvent.ON_USER_ONLINE, userData.id);
    store.dispatch(setChannelUserList([{ ...userData, isOnline: false }]));

    customRender(<ChannelSocketListener />);

    // expect store
    expect(store.getState().channelUsers.list[0].isOnline).toBeTruthy();
  });

  test("when server return updated channel's updatedTime", () => {
    const data = { channelId: publicChannel.id, updatedTime: 100000000 };
    spyListener(SocketEvent.ON_EDITED_CHANNEL_UPDATED_TIME, data);
    store.dispatch(setChannelsList([{ ...publicChannel, updatedTime: 0 }]));

    customRender(<ChannelSocketListener />);

    // expect store
    expect(store.getState().channels.list).toEqual([{ ...publicChannel, updatedTime: 100000000 }]);
  });

  test("when server return updated channel's unreadMessageCount", () => {
    const data = { channelId: publicChannel.id, unreadMessageCount: 5 };
    spyListener(SocketEvent.ON_EDITED_CHANNEL_UNREAD_MESSAGE_COUNT, data);
    store.dispatch(setChannelsList([{ ...publicChannel, unreadMessageCount: 0 }]));

    customRender(<ChannelSocketListener />);

    // expect store
    expect(store.getState().channels.list).toEqual([{ ...publicChannel, unreadMessageCount: 5 }]);
  });

  test("when server return updated user online", () => {
    spyListener(SocketEvent.ON_USER_ONLINE, userData.id);
    store.dispatch(setChannelUserList([{ ...userData, isOnline: false }]));

    customRender(<ChannelSocketListener />);

    // expect store
    expect(store.getState().channelUsers.list).toEqual([{ ...userData, isOnline: true }]);
  });

  test("when server return updated user offline", () => {
    spyListener(SocketEvent.ON_USER_OFFLINE, userData.id);
    store.dispatch(setChannelUserList([{ ...userData, isOnline: true }]));

    customRender(<ChannelSocketListener />);

    // expect store
    expect(store.getState().channelUsers.list).toEqual([{ ...userData, isOnline: false }]);
  });
});
