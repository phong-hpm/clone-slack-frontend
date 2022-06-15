// store
import { setupStore } from "store";

// redux slices
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";
import { updateChannelUserOnline } from "store/slices/channelUsers.slice";
import { setTeamUserList } from "store/slices/teamUsers.slice";

// types
import { ChannelType, UserType } from "store/slices/_types";

let store = setupStore();

const userData: UserType = {
  id: "U-o29OsxUsn",
  name: "Phong Ho",
  realname: "Phong Ho Pham Minh",
  email: "phonghophamminh@gmail.com",
  timeZone: "",
  avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
};

const publicChannel: ChannelType = {
  id: "C-111111",
  type: "public_channel",
  name: "general",
  users: [userData.id],
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  topic: "Channel topic",
  unreadMessageCount: 79,
  partner: userData,
};

beforeEach(() => {
  store = setupStore();
});

describe("disptach setChannelUserList automaticaly", () => {
  test("When setTeamUserList, setSelectedChannelId, setChannelsList were dispatched", () => {
    expect(store.getState().channelUsers.list).toEqual([]);

    store.dispatch(setTeamUserList([userData]));
    store.dispatch(setChannelsList([publicChannel]));
    store.dispatch(setSelectedChannelId(publicChannel.id));

    expect(store.getState().channelUsers.list).toEqual([userData]);
  });
});

describe("disptach updateChannelParterOnline and updateTeamUserOnline automaticaly", () => {
  test("When updateChannelUserOnline was dispatched", () => {
    store.dispatch(setTeamUserList([userData]));
    store.dispatch(setChannelsList([publicChannel]));

    expect(store.getState().teamUsers.list[0].isOnline).toBeFalsy();
    expect(store.getState().channels.list[0].partner?.isOnline).toBeFalsy();

    store.dispatch(updateChannelUserOnline({ id: userData.id, isOnline: true }));

    expect(store.getState().teamUsers.list[0].isOnline).toBeTruthy();
    expect(store.getState().channels.list[0].partner?.isOnline).toBeTruthy();
  });
});
