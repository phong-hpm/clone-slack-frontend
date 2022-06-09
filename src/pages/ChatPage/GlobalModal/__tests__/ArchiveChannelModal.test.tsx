import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// redux slices
import { setOpenArchiveChannelModal } from "store/slices/globalModal.slice";
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";

// components
import ArchiveChannelModal from "../ArchiveChannelModal";

// utils
import { customRender, store } from "tests";

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

beforeEach(() => {
  store.dispatch(setOpenArchiveChannelModal(true));
  store.dispatch(setSelectedChannelId(channelData.id));
  store.dispatch(setChannelsList([channelData]));
});

const expectModalOpening = () => {
  expect(store.getState().globalModal.isOpenArchiveChannelModal).toBeTruthy();
  expect(screen.getByText("Achive this channel?")).toBeInTheDocument();
};

const expectModalClosed = () => {
  expect(store.getState().globalModal.isOpenArchiveChannelModal).toBeFalsy();
  expect(screen.queryByText("Achive this channel?")).toBeNull();
};

describe("Test render", () => {
  test("Render with empty redux state", () => {
    store.dispatch(setOpenArchiveChannelModal(false));
    store.dispatch(setSelectedChannelId(""));
    store.dispatch(setChannelsList([]));

    customRender(<ArchiveChannelModal />);
    expectModalClosed();
  });

  test("Render ArchiveChannelModal", async () => {
    customRender(<ArchiveChannelModal />);

    expectModalOpening();
  });
});

describe("Test actions", () => {
  test("Click Cancel", async () => {
    customRender(<ArchiveChannelModal />);

    expectModalOpening();
    userEvent.click(screen.getByText("Cancel"));
    expectModalClosed();
  });

  test("Click Archive Channel", async () => {
    customRender(<ArchiveChannelModal />);

    expectModalOpening();
    userEvent.click(screen.getByText("Archive Channel"));
    expectModalClosed();
  });
});
