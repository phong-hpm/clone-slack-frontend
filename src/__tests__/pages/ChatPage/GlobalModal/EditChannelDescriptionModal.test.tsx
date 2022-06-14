import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockIO from "socket.io-client";

// redux slices
import { setChannelSocket } from "store/slices/socket.slice";
import { setOpenEditChannelDescriptionModal } from "store/slices/globalModal.slice";
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";

// components
import EditChannelDescriptionModal from "pages/ChatPage/GlobalModal/EditChannelDescriptionModal";

// utils
import { customRender, store } from "__tests__/__setups__";
import { SocketEvent } from "utils/constants";

// types
import { ChannelType } from "store/slices/_types";

const channelData: ChannelType = {
  id: "C-YHAtcdvh00",
  type: "public_channel",
  name: "Channel 1",
  users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
};

const channelSocket = mockIO();

beforeEach(() => {
  store.dispatch(setOpenEditChannelDescriptionModal(true));
  store.dispatch(setSelectedChannelId(channelData.id));
  store.dispatch(setChannelsList([channelData]));
  store.dispatch(setChannelSocket(channelSocket));
  (channelSocket.emit as jest.Mock).mockClear();
});

const expectModalOpening = () => {
  expect(store.getState().globalModal.isOpenEditChannelDescriptionModal).toBeTruthy();
  expect(screen.getByText("Edit description")).toBeInTheDocument();
};

const expectModalClosed = () => {
  expect(store.getState().globalModal.isOpenEditChannelDescriptionModal).toBeFalsy();
  expect(screen.queryByText("Edit description")).toBeNull();
};

describe("Test render", () => {
  test("Render with empty redux state", () => {
    store.dispatch(setOpenEditChannelDescriptionModal(false));
    store.dispatch(setSelectedChannelId(""));
    store.dispatch(setChannelsList([]));

    customRender(<EditChannelDescriptionModal />);
    expectModalClosed();
  });

  test("Render with default description state", () => {
    store.dispatch(setChannelsList([{ ...channelData, desc: "description" }]));

    customRender(<EditChannelDescriptionModal />);
    expectModalOpening();
    expect(screen.getByDisplayValue("description")).toBeInTheDocument();
  });

  test("Render EditChannelDescriptionModal", async () => {
    customRender(<EditChannelDescriptionModal />);

    expectModalOpening();
  });
});

describe("Test actions", () => {
  test("Click Cancel", async () => {
    customRender(<EditChannelDescriptionModal />);

    expectModalOpening();
    userEvent.click(screen.getByText("Cancel"));
    expectModalClosed();
  });

  test("Click Save", async () => {
    customRender(<EditChannelDescriptionModal />);

    expectModalOpening();
    userEvent.type(screen.getByPlaceholderText("Add a description"), "description");
    userEvent.click(screen.getByText("Save"));
    expectModalClosed();
    expect(mockIO().emit as jest.Mock).toBeCalledWith(
      SocketEvent.EMIT_EDIT_CHANNEL_OPTIONAL_FIELDS,
      { data: { id: channelData.id, desc: "description" } }
    );
  });
});
