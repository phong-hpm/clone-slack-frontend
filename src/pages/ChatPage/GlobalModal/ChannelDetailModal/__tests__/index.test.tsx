import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockIO from "socket.io-client";

// redux slices
import { setChannelSocket } from "store/slices/socket.slice";
import { setOpenChannelDetailModal } from "store/slices/globalModal.slice";
import { setChannelsList, setSelectedChannelId, updateChannel } from "store/slices/channels.slice";

// components
import ChannelDetailModal from "..";

// utils
import { store, customRender } from "tests";
import { SocketEvent } from "utils/constants";

// types
import { ChannelType } from "store/slices/_types";

jest.mock("pages/ChatPage/GlobalModal/ChannelDetailModal/AboutTab", () => () => (
  <div>AboutTab</div>
));
jest.mock("pages/ChatPage/GlobalModal/ChannelDetailModal/MemberTab", () => () => (
  <div>MemberTab</div>
));
jest.mock("pages/ChatPage/GlobalModal/ChannelDetailModal/IntegrationTab", () => () => (
  <div>IntegrationTab</div>
));
jest.mock("pages/ChatPage/GlobalModal/ChannelDetailModal/SettingTab", () => () => (
  <div>SettingTab</div>
));

const channelSocket = mockIO();

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

beforeEach(() => {
  store.dispatch(setOpenChannelDetailModal(true));
  store.dispatch(setChannelsList([publicChannel, directMessage]));
  store.dispatch(setSelectedChannelId(publicChannel.id));
  store.dispatch(setChannelSocket(channelSocket));
});

describe("Test render", () => {
  test("When no channel was selected", () => {
    store.dispatch(setSelectedChannelId(""));
    customRender(<ChannelDetailModal />);

    expect(screen.queryByText(publicChannel.name)).toBeNull();
    expect(screen.queryByText("AboutTab")).toBeNull();
  });

  test("When a public channel was selected", () => {
    customRender(<ChannelDetailModal />);

    expect(screen.getByText(publicChannel.name)).toBeInTheDocument();
    expect(screen.getByText("about")).toBeInTheDocument();
    expect(screen.getByText(`members ${publicChannel.users.length}`)).toBeInTheDocument();
    expect(screen.getByText("integrations")).toBeInTheDocument();
    expect(screen.getByText("settings")).toBeInTheDocument();
  });

  test("When a direct message was selected", () => {
    store.dispatch(setSelectedChannelId(directMessage.id));
    customRender(<ChannelDetailModal />);

    expect(screen.getByText(directMessage.name)).toBeInTheDocument();
    expect(screen.getByText("about")).toBeInTheDocument();
    expect(screen.queryByText(`members ${publicChannel.users.length}`)).toBeNull();
    expect(screen.getByText("integrations")).toBeInTheDocument();
    expect(screen.queryByText("settings")).toBeNull();
  });

  test("When a direct message was selected", () => {
    store.dispatch(setChannelsList([directMessage]));
    store.dispatch(setSelectedChannelId(directMessage.id));
    customRender(<ChannelDetailModal />);

    expect(screen.getByText(directMessage.name)).toBeInTheDocument();
    expect(screen.getByText("about")).toBeInTheDocument();
    expect(screen.queryByText(/members/)).toBeNull();
    expect(screen.getByText("integrations")).toBeInTheDocument();
    expect(screen.queryByText("settings")).toBeNull();
  });

  test("When notification is all", () => {
    store.dispatch(setChannelsList([{ ...publicChannel, notification: "all" }]));
    customRender(<ChannelDetailModal />);

    expect(screen.getByText("Get Notifications for All Messages")).toBeInTheDocument();
    expect(
      screen.getByLabelText("You will be notified about all messages sent to this channel")
    ).toBeInTheDocument();
  });

  test("When notification is mention", () => {
    store.dispatch(setChannelsList([{ ...publicChannel, notification: "mention" }]));
    customRender(<ChannelDetailModal />);

    expect(screen.getByText("Get notifications for @ Mentions")).toBeInTheDocument();
    expect(
      screen.getByLabelText("You will be notified when you're mentioned in this channel")
    ).toBeInTheDocument();
  });

  test("When notification is off", () => {
    store.dispatch(setChannelsList([{ ...publicChannel, notification: "off" }]));
    customRender(<ChannelDetailModal />);

    expect(screen.getByText("Notifications Off")).toBeInTheDocument();
    expect(
      screen.getByLabelText("You won't get notifications about this channel")
    ).toBeInTheDocument();
  });

  test("When notification is muted", () => {
    store.dispatch(setChannelsList([{ ...publicChannel, isMuted: true }]));
    customRender(<ChannelDetailModal />);

    expect(screen.getByText("Muted")).toBeInTheDocument();
    expect(
      screen.getByLabelText("You'll only see a badge if you're mentioned in this channel")
    ).toBeInTheDocument();
  });
});

describe("Test render tabs", () => {
  test("When Abount tab was selected", () => {
    customRender(<ChannelDetailModal />);

    userEvent.click(screen.getByText("about"));
    expect(screen.getByText("AboutTab")).toBeInTheDocument();
    expect(screen.queryByText("MemberTab")).toBeNull();
    expect(screen.queryByText("IntegrationTab")).toBeNull();
    expect(screen.queryByText("SettingTab")).toBeNull();
  });

  test("When Members tab was selected", () => {
    customRender(<ChannelDetailModal />);

    userEvent.click(screen.getByText(`members ${publicChannel.users.length}`));
    expect(screen.queryByText("AboutTab")).toBeNull();
    expect(screen.getByText("MemberTab")).toBeInTheDocument();
    expect(screen.queryByText("IntegrationTab")).toBeNull();
    expect(screen.queryByText("SettingTab")).toBeNull();
  });

  test("When Integrations tab was selected", () => {
    customRender(<ChannelDetailModal />);

    userEvent.click(screen.getByText("integrations"));
    expect(screen.queryByText("AboutTab")).toBeNull();
    expect(screen.queryByText("MemberTab")).toBeNull();
    expect(screen.getByText("IntegrationTab")).toBeInTheDocument();
    expect(screen.queryByText("SettingTab")).toBeNull();
  });

  test("When Setting tab was selected", () => {
    customRender(<ChannelDetailModal />);

    userEvent.click(screen.getByText("settings"));
    expect(screen.queryByText("AboutTab")).toBeNull();
    expect(screen.queryByText("MemberTab")).toBeNull();
    expect(screen.queryByText("IntegrationTab")).toBeNull();
    expect(screen.getByText("SettingTab")).toBeInTheDocument();
  });
});

describe("Render actions", () => {
  test("Press esc to close modal", () => {
    customRender(<ChannelDetailModal />);

    expect(screen.getByText(publicChannel.name)).toBeInTheDocument();
    userEvent.keyboard("{esc}");
    expect(screen.queryByText(publicChannel.name)).toBeNull();
  });

  test("Click star button", async () => {
    customRender(<ChannelDetailModal />);

    userEvent.click(screen.getByLabelText("Star channel"));
    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_EDIT_CHANNEL_OPTIONAL_FIELDS, {
      data: { id: publicChannel.id, isStarred: true },
    });
    store.dispatch(updateChannel({ id: publicChannel.id, channel: { isStarred: true } }));
    await waitFor(() => expect(screen.getByLabelText("Remove from Starred")).toBeInTheDocument());
  });

  test("Select notification", async () => {
    store.dispatch(setChannelsList([{ ...publicChannel, notification: "mention" }]));
    customRender(<ChannelDetailModal />);

    // Click to show menu
    userEvent.click(screen.getByText("Get notifications for @ Mentions"));
    // Select a notification
    userEvent.click(screen.getByText("All messages"));
    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_EDIT_CHANNEL_OPTIONAL_FIELDS, {
      data: { id: publicChannel.id, notification: "all" },
    });
  });
});
