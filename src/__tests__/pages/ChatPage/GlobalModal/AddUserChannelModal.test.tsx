import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockIO from "socket.io-client";

// redux slices
import { setUser } from "store/slices/user.slice";
import { setChannelSocket } from "store/slices/socket.slice";
import { setTeamUserList } from "store/slices/teamUsers.slice";
import { setOpenAddUserChannelModal } from "store/slices/globalModal.slice";
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";

// components
import AddUserChannelModal from "pages/ChatPage/GlobalModal/AddUserChannelModal";

// utils
import { customRender, store } from "__tests__/__setups__";
import { SocketEvent } from "utils/constants";

// types
import { ChannelType } from "store/slices/_types";

const channelSocket = mockIO();

const user_1 = {
  id: "U-111111111",
  name: "User 1",
  realname: "User Real Name 1",
  email: "",
  timeZone: "",
  teams: [],
};

const user_2 = {
  id: "U-222222222",
  name: "User 2",
  realname: "User Real Name 2",
  email: "",
  timeZone: "",
  teams: [],
};

const user_3 = {
  id: "U-333333333",
  name: "User 3",
  realname: "User Real Name 3",
  email: "",
  timeZone: "",
  teams: [],
};

const publicChannel: ChannelType = {
  id: "C-111111",
  type: "public_channel",
  name: "general",
  users: [user_1.id],
  creator: "U-123456",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  unreadMessageCount: 79,
};

beforeEach(() => {
  store.dispatch(setUser(user_1));
  store.dispatch(setChannelSocket(channelSocket));
  store.dispatch(setChannelsList([publicChannel]));
  store.dispatch(setSelectedChannelId(publicChannel.id));
  store.dispatch(setTeamUserList([user_1, user_2, user_3]));
  store.dispatch(setOpenAddUserChannelModal(true));
});

describe("Test render", () => {
  test("Render AddUserChannelModal", () => {
    customRender(<AddUserChannelModal />);

    expect(screen.getByText(/Add people to/)).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click submit", () => {
    customRender(<AddUserChannelModal />);

    // Click to show dropdown
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    // Select the first user
    userEvent.click(screen.getByText("User Real Name 2"));
    // Click to show dropdown
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    // Select the second user
    userEvent.click(screen.getByText("User Real Name 3"));

    // Click submit
    userEvent.click(screen.getByText("Add"));

    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_ADD_USERS_TO_CHANNEL, {
      data: { id: publicChannel.id, userIds: [user_2.id, user_3.id] },
    });
    expect(store.getState().globalModal.isOpenAddUserChannel).toBeFalsy();
  });
});
