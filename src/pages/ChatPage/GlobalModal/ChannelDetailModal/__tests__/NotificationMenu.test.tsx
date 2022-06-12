import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockIO from "socket.io-client";

// redux slices
import { setChannelSocket } from "store/slices/socket.slice";
import { setOpenChannelDetailModal } from "store/slices/globalModal.slice";
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";

// components
import NotificationMenu from "../NotificationMenu";

// utils
import { store, customRender } from "tests";
import { SocketEvent } from "utils/constants";

// types
import { ChannelType } from "store/slices/_types";

const channelSocket = mockIO();
const anchorEl = document.createElement("div");

const publicChannel: ChannelType = {
  id: "C-111111",
  type: "public_channel",
  name: "general",
  users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  unreadMessageCount: 79,
  notification: "all",
};

beforeEach(() => {
  store.dispatch(setOpenChannelDetailModal(true));
  store.dispatch(setChannelsList([publicChannel]));
  store.dispatch(setSelectedChannelId(publicChannel.id));
  store.dispatch(setChannelSocket(channelSocket));
});

describe("Test render", () => {
  test("When no channel was selected", () => {
    store.dispatch(setSelectedChannelId(""));
    customRender(<NotificationMenu open anchorEl={anchorEl} />);

    expect(screen.queryByText("More notification options")).toBeNull();
  });

  test("When a public channel was selected", () => {
    customRender(<NotificationMenu open anchorEl={anchorEl} />);

    expect(screen.getByText("All messages")).toBeInTheDocument();
    expect(screen.getByText("@ Mentions")).toBeInTheDocument();
    expect(screen.getByText("Off")).toBeInTheDocument();
    expect(screen.getByText("Mute channel")).toBeInTheDocument();
    expect(screen.getByText("More notification options")).toBeInTheDocument();
  });

  test("When channel is muted", () => {
    store.dispatch(setChannelsList([{ ...publicChannel, isMuted: true }]));
    customRender(<NotificationMenu open anchorEl={anchorEl} />);

    expect(screen.queryByText("All messages")).toBeNull();
    expect(screen.queryByText("@ Mentions")).toBeNull();
    expect(screen.queryByText("Off")).toBeNull();
    expect(screen.getByText("Unmute channel")).toBeInTheDocument();
    expect(screen.getByText("More notification options")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Select mute option", () => {
    store.dispatch(setChannelsList([{ ...publicChannel, isMuted: false }]));
    const mockOnClose = jest.fn();
    customRender(<NotificationMenu open anchorEl={anchorEl} onClose={mockOnClose} />);

    userEvent.click(screen.getByText("Mute channel"));
    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_EDIT_CHANNEL_OPTIONAL_FIELDS, {
      data: { id: publicChannel.id, isMuted: true },
    });
    expect(mockOnClose).toBeCalledWith({}, "backdropClick");
  });

  test("Select all notification option", () => {
    store.dispatch(setChannelsList([{ ...publicChannel, notification: "mention" }]));
    const mockOnClose = jest.fn();
    customRender(<NotificationMenu open anchorEl={anchorEl} onClose={mockOnClose} />);

    userEvent.click(screen.getByText("All messages"));
    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_EDIT_CHANNEL_OPTIONAL_FIELDS, {
      data: { id: publicChannel.id, notification: "all" },
    });
    expect(mockOnClose).toBeCalledWith({}, "backdropClick");
  });
});
