import { screen } from "@testing-library/react";

// redux slices
import { setUser } from "store/slices/user.slice";
import { setChannelUserList } from "store/slices/channelUsers.slice";
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";

// components
import Conversation from "pages/ChatPage/Conversation";

// utils
import { customRender, store } from "__tests__/__setups__";

jest.mock("pages/ChatPage/Conversation/ChatBox/MessageInput", () => () => <div>MessageInput</div>);

// types
import { ChannelType } from "store/slices/_types";
import userEvent from "@testing-library/user-event";

const user_1 = {
  id: "U-111111111",
  name: "User 1",
  realname: "User Real Name 1",
  email: "",
  timeZone: "",
  teams: [],
};

const publicChannel: ChannelType = {
  id: "C-111111",
  type: "public_channel",
  name: "general",
  users: [user_1.id],
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  topic: "Channel topic",
  unreadMessageCount: 79,
};
const directMessage: ChannelType = {
  id: "C-444444",
  type: "direct_message",
  name: "Direct message",
  users: [user_1.id],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  isStarred: true,
  partner: user_1,
};

beforeEach(() => {
  store.dispatch(setUser(user_1));
  store.dispatch(setChannelUserList([user_1]));
  store.dispatch(setChannelsList([publicChannel, directMessage]));
  store.dispatch(setSelectedChannelId(publicChannel.id));
});

describe("Test render", () => {
  test("When public channel was selected", () => {
    customRender(<Conversation />);

    expect(screen.getByLabelText("Add a bookmark")).toBeInTheDocument();
    expect(screen.getByText("Add a bookmark")).toBeInTheDocument();
    expect(screen.getByText("MessageInput")).toBeInTheDocument();
    // userList avatar in [ConversationHeader]
    expect(document.getElementsByTagName("img")).toHaveLength(1);
  });

  test("When no channel was selected", () => {
    store.dispatch(setSelectedChannelId(""));
    customRender(<Conversation />);

    expect(screen.getByLabelText("Add a bookmark")).toBeInTheDocument();
    expect(screen.getByText("Add a bookmark")).toBeInTheDocument();
    expect(screen.getByText("MessageInput")).toBeInTheDocument();
    // userList avatar in [ConversationHeader]
    expect(document.getElementsByTagName("img")).toHaveLength(1);
  });

  test("When direct message was selected", () => {
    store.dispatch(setSelectedChannelId(directMessage.id));
    customRender(<Conversation />);

    expect(screen.getByLabelText("Add a bookmark")).toBeInTheDocument();
    expect(screen.getByText("Add a bookmark")).toBeInTheDocument();
    expect(screen.getByText("MessageInput")).toBeInTheDocument();
    // channel avatar and userList avatar in [ConversationHeader]
    expect(document.getElementsByTagName("img")).toHaveLength(2);
  });
});

describe("Test actions", () => {
  test("Click the topic of channel", () => {
    customRender(<Conversation />);

    userEvent.click(screen.getByText("Channel topic"));
    expect(store.getState().globalModal.isOpenEditChannelTopicModal).toBeTruthy();
  });

  test("Click Channel button on Channel Header", () => {
    customRender(<Conversation />);

    userEvent.click(screen.getByLabelText("Get channel details"));
    expect(store.getState().globalModal.isOpenChannelDetail).toBeTruthy();
  });

  test("coverage", () => {
    customRender(<Conversation />);

    userEvent.hover(screen.getByLabelText("View all members of this channel"));
    userEvent.unhover(screen.getByLabelText("View all members of this channel"));
  });
});
