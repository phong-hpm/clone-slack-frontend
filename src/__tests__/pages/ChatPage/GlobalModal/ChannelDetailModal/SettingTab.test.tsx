import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// redux slices
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";

// components
import SettingTab from "pages/ChatPage/GlobalModal/ChannelDetailModal/SettingTab";

// utils
import { store, customRender } from "__tests__/__setups__";

// types
import { ChannelType } from "store/slices/_types";

const publicChannel: ChannelType = {
  id: "C-111111",
  type: "public_channel",
  name: "general",
  users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
  creator: "U-123456",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  unreadMessageCount: 79,
};

beforeEach(() => {
  store.dispatch(setChannelsList([publicChannel]));
  store.dispatch(setSelectedChannelId(publicChannel.id));
});

describe("Test render", () => {
  test("When no channel was selected", () => {
    store.dispatch(setSelectedChannelId(""));
    customRender(<SettingTab />);

    expect(screen.queryByText("Huddles")).toBeNull();
  });

  test("When a public channel was selected", () => {
    customRender(<SettingTab />);

    expect(screen.getByText("Huddles")).toBeInTheDocument();
    expect(screen.getByText("Archive channel for everyone")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click Archive channel for everyone", () => {
    customRender(<SettingTab />);

    userEvent.click(screen.getByText("Archive channel for everyone"));
    expect(store.getState().globalModal.isOpenArchiveChannelModal).toBeTruthy();
  });

  test("Click Change to a private channel", () => {
    store.dispatch(setChannelsList([{ ...publicChannel, type: "group_message" }]));
    customRender(<SettingTab />);

    userEvent.click(screen.getByText("Change to a private channel"));
    expect(store.getState().globalModal.isOpenEditChannelNameModal).toBeTruthy();
  });
});
