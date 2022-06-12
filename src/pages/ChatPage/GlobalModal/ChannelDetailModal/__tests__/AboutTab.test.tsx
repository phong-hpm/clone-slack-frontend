import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockIO from "socket.io-client";
import { useNavigate } from "react-router-dom";

// redux slices
import { setUser } from "store/slices/user.slice";
import { setChannelSocket } from "store/slices/socket.slice";
import { setChannelUserList } from "store/slices/channelUsers.slice";
import { setOpenChannelDetailModal } from "store/slices/globalModal.slice";
import { setChannelsList, setSelectedChannelId, updateChannel } from "store/slices/channels.slice";

// components
import AboutTab from "../AboutTab";

// utils
import { store, customRender } from "tests";
import { routePaths, SocketEvent } from "utils/constants";

// types
import { ChannelType } from "store/slices/_types";

const channelSocket = mockIO();

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
  creator: "U-123456",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  unreadMessageCount: 79,
  partner: userData,
};

beforeEach(() => {
  store.dispatch(setUser({ ...userData, id: "U-123456" }));
  store.dispatch(setChannelUserList([userData]));
  store.dispatch(setOpenChannelDetailModal(true));
  store.dispatch(setChannelsList([publicChannel]));
  store.dispatch(setSelectedChannelId(publicChannel.id));
  store.dispatch(setChannelSocket(channelSocket));
});

describe("Test render", () => {
  test("When no channel was selected", () => {
    store.dispatch(setSelectedChannelId(""));
    customRender(<AboutTab />);

    expect(screen.queryByText(/Channel ID/)).toBeNull();
  });

  test("When a public channel was selected", () => {
    customRender(<AboutTab />);

    expect(screen.getByText(`Channel ID: ${publicChannel.id}`)).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click to open edit channel name", () => {
    customRender(<AboutTab />);

    userEvent.click(screen.getByText("Channel name"));
    expect(store.getState().globalModal.isOpenEditChannelNameModal).toBeTruthy();
  });

  test("Click to open edit channel topic", () => {
    customRender(<AboutTab />);

    userEvent.click(screen.getByText("Topic"));
    expect(store.getState().globalModal.isOpenEditChannelTopicModal).toBeTruthy();
  });

  test("Click to open edit channel description", () => {
    customRender(<AboutTab />);

    userEvent.click(screen.getByText("Description"));
    expect(store.getState().globalModal.isOpenEditChannelDescriptionModal).toBeTruthy();
  });

  test("Click leave channel", () => {
    const mockNavigate = useNavigate();
    customRender(<AboutTab />);

    userEvent.click(screen.getByText("Leave Channel"));
    expect(store.getState().globalModal.isOpenChannelDetail).toBeFalsy();
    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_USER_LEAVE_CHANNEL, {
      data: { id: publicChannel.id },
    });
    expect(mockNavigate).toBeCalledWith(`${routePaths.CHATBOX_PAGE}/teamId/${publicChannel.id}`);
  });

  test("Click Copy channel id", () => {
    const mockWriteText = jest.fn();
    Object.assign(navigator, { clipboard: { writeText: mockWriteText } });
    customRender(<AboutTab />);

    userEvent.click(screen.getByLabelText("Copy channel id"));
    expect(mockWriteText).toBeCalledWith(publicChannel.id);
  });
});
