import { fireEvent, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockIO from "socket.io-client";

// redux slices
import { setOpenEditChannelNameModal } from "store/slices/globalModal.slice";
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";
import { setChannelSocket } from "store/slices/socket.slice";

// components
import EditChannelNameModal from "pages/ChatPage/GlobalModal/EditChannelNameModal";

// utils
import { customRender, store } from "__tests__/__setups__";
import { SocketEvent } from "utils/constants";

// types
import { ChannelType } from "store/slices/_types";

const channelData: ChannelType = {
  id: "C-YHAtcdvh00",
  type: "public_channel",
  name: "",
  users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
};

const channelSocket = mockIO();

beforeEach(() => {
  store.dispatch(setOpenEditChannelNameModal(true));
  store.dispatch(setSelectedChannelId(channelData.id));
  store.dispatch(setChannelsList([channelData]));
  store.dispatch(setChannelSocket(channelSocket));
  (channelSocket.emit as jest.Mock).mockClear();
});

const expectModalOpening = (name = "Rename this channel") => {
  expect(store.getState().globalModal.isOpenEditChannelNameModal).toBeTruthy();
  expect(screen.getByText(name)).toBeInTheDocument();
};

const expectModalClosed = (name = "Rename this channel") => {
  expect(store.getState().globalModal.isOpenEditChannelNameModal).toBeFalsy();
  expect(screen.queryByText(name)).toBeNull();
};

describe("Test render", () => {
  test("Render with empty redux state", () => {
    store.dispatch(setOpenEditChannelNameModal(false));
    store.dispatch(setSelectedChannelId(""));
    store.dispatch(setChannelsList([]));

    customRender(<EditChannelNameModal />);
    expectModalClosed();
  });

  test("Render with default name state", () => {
    store.dispatch(setChannelsList([{ ...channelData, name: "name" }]));

    customRender(<EditChannelNameModal />);
    expectModalOpening();
    expect(screen.getByDisplayValue("name")).toBeInTheDocument();
  });

  test("Render with public_channel", async () => {
    customRender(<EditChannelNameModal />);

    expectModalOpening();
  });

  test("Render with group_message", async () => {
    store.dispatch(setChannelsList([{ ...channelData, type: "group_message" }]));
    customRender(<EditChannelNameModal />);

    expectModalOpening("Change to private channel?");
  });

  test("Render error after bluring with empty value", async () => {
    customRender(<EditChannelNameModal />);

    fireEvent.focus(screen.getByPlaceholderText("e.g marketing"));
    fireEvent.blur(screen.getByPlaceholderText("e.g marketing"));
    expect(screen.getByText("Don't forget to name your channel.")).toBeInTheDocument();
  });

  test("Render error after bluring with value over 80 characters", async () => {
    customRender(<EditChannelNameModal />);

    userEvent.type(screen.getByPlaceholderText("e.g marketing"), "channel".repeat(20));
    fireEvent.blur(screen.getByPlaceholderText("e.g marketing"));
    expect(
      screen.getByText("Channel names can't be longer than 80 characters.")
    ).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click Cancel", async () => {
    customRender(<EditChannelNameModal />);

    expectModalOpening();
    userEvent.click(screen.getByText("Cancel"));
    expectModalClosed();
  });

  test("Click Save Changes button", async () => {
    customRender(<EditChannelNameModal />);

    expectModalOpening();
    userEvent.type(screen.getByPlaceholderText("e.g marketing"), "name");
    userEvent.click(screen.getByText("Save Changes"));
    expectModalClosed();
    expect(mockIO().emit as jest.Mock).toBeCalledWith(SocketEvent.EMIT_EDIT_CHANNEL_NAME, {
      data: { id: channelData.id, name: "name" },
    });
  });

  test("Click Change to private button", async () => {
    store.dispatch(setChannelsList([{ ...channelData, type: "group_message" }]));
    customRender(<EditChannelNameModal />);

    expectModalOpening("Change to private channel?");
    userEvent.type(screen.getByPlaceholderText("e.g marketing"), "name");
    userEvent.click(screen.getByText("Change to private"));
    expectModalClosed();
    expect(mockIO().emit as jest.Mock).toBeCalledWith(SocketEvent.EMIT_CHANGE_TO_PRIVATE_CHANNEL, {
      data: { id: channelData.id, name: "name" },
    });
  });
});
