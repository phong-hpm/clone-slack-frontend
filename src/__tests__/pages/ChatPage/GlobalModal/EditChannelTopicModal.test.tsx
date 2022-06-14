import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockIO from "socket.io-client";

// redux slices
import { setOpenEditChannelTopicModal } from "store/slices/globalModal.slice";
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";
import { setChannelSocket } from "store/slices/socket.slice";

// components
import EditChannelTopicModal from "pages/ChatPage/GlobalModal/EditChannelTopicModal";

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
  store.dispatch(setOpenEditChannelTopicModal(true));
  store.dispatch(setSelectedChannelId(channelData.id));
  store.dispatch(setChannelsList([channelData]));
  store.dispatch(setChannelSocket(channelSocket));
  (channelSocket.emit as jest.Mock).mockClear();
});

const expectModalOpening = () => {
  expect(store.getState().globalModal.isOpenEditChannelTopicModal).toBeTruthy();
  expect(screen.getByText("Edit topic")).toBeInTheDocument();
};

const expectModalClosed = () => {
  expect(store.getState().globalModal.isOpenEditChannelTopicModal).toBeFalsy();
  expect(screen.queryByText("Edit topic")).toBeNull();
};

describe("Test render", () => {
  test("Render with empty redux state", () => {
    store.dispatch(setOpenEditChannelTopicModal(false));
    store.dispatch(setSelectedChannelId(""));
    store.dispatch(setChannelsList([]));

    customRender(<EditChannelTopicModal />);
    expectModalClosed();
  });

  test("Render with default topic state", () => {
    store.dispatch(setChannelsList([{ ...channelData, topic: "topic" }]));

    customRender(<EditChannelTopicModal />);
    expectModalOpening();
    expect(screen.getByDisplayValue("topic")).toBeInTheDocument();
  });

  test("Render EditChannelTopicModal", async () => {
    customRender(<EditChannelTopicModal />);

    expectModalOpening();
  });
});

describe("Test actions", () => {
  test("Click Cancel", async () => {
    customRender(<EditChannelTopicModal />);

    expectModalOpening();
    userEvent.click(screen.getByText("Cancel"));
    expectModalClosed();
  });

  test("Click Save", async () => {
    customRender(<EditChannelTopicModal />);

    expectModalOpening();
    userEvent.type(screen.getByPlaceholderText("Add a topic"), "topic");
    userEvent.click(screen.getByText("Save"));
    expectModalClosed();
    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_EDIT_CHANNEL_OPTIONAL_FIELDS, {
      data: { id: channelData.id, topic: "topic" },
    });
  });
});
