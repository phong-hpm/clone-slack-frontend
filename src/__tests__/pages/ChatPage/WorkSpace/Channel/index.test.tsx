import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// redux slices
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";

// utils
import { customRender, store } from "__tests__/__setups__";

// components
import Channel from "pages/ChatPage/WorkSpace/Channel";

// types
import { ChannelType } from "store/slices/_types";

const channelList: ChannelType[] = [
  {
    id: "C-111111111",
    type: "public_channel",
    name: "general",
    users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
    unreadMessageCount: 0,
    creator: "U-o29OsxUsn",
    createdTime: 1650353609205,
    updatedTime: 1654589660640,
  },
  {
    id: "C-22222222",
    type: "group_message",
    name: "Group message",
    users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
    unreadMessageCount: 0,
    creator: "U-o29OsxUsn",
    createdTime: 1650353609205,
    updatedTime: 1654589660640,
  },
  {
    id: "C-333333",
    type: "direct_message",
    name: "general",
    users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
    unreadMessageCount: 0,
    creator: "U-o29OsxUsn",
    createdTime: 1650353609205,
    updatedTime: 1654589660640,
    isStarred: true,
  },
];

beforeEach(() => {
  store.dispatch(setSelectedChannelId(channelList[0].id));
  store.dispatch(setChannelsList(channelList));
});

describe("Test render", () => {
  test("When no channel was selected", () => {
    store.dispatch(setSelectedChannelId(""));
    customRender(<Channel />);

    expect(screen.queryByText("Mentions & reactions")).toBeNull();
  });

  test("When a channel was selected", () => {
    customRender(<Channel />);

    expect(screen.getByText("Mentions & reactions")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click Add channel", () => {
    customRender(<Channel />);

    userEvent.click(screen.getByText("Add channels"));
    expect(store.getState().globalModal.isOpenCreateChannel).toBeTruthy();
  });

  test("Click Add teammates", () => {
    customRender(<Channel />);

    userEvent.click(screen.getByText("Add teammates"));
    expect(store.getState().globalModal.isOpenCreateChannel).toBeTruthy();
  });
});
