import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockIO from "socket.io-client";

// redux slices
import { setUser } from "store/slices/user.slice";
import { setChannelUserList } from "store/slices/channelUsers.slice";
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";

// components
import ShareMessageModal from "pages/ChatPage/Conversation/ChatBox/MessageContent/ShareMessageModal";

// utils
import { customRender, store } from "__tests__/__setups__";

jest.mock("pages/ChatPage/Conversation/ChatBox/MessageInput", () => (props: MessageInputProps) => (
  <div data-testid="MessageInput">
    <div
      data-testid="fire-onBlur"
      onClick={() => props.onBlur?.({ ops: [{ insert: "hi\n" }] } as unknown as Delta)}
    />
  </div>
));

// types
import { Delta } from "quill";
import { ChannelType, MessageType } from "store/slices/_types";
import { MessageInputProps } from "pages/ChatPage/Conversation/ChatBox/MessageInput";
import { setMessageSocket } from "store/slices/socket.slice";
import { SocketEvent } from "utils/constants";

const messageSocket = mockIO();

const user_1 = {
  id: "U-111111111",
  name: "User name 1",
  realname: "User Real Name 1",
  email: "",
  timeZone: "",
  teams: [],
};

const user_2 = {
  id: "U-111111111",
  name: "User name 2",
  realname: "User Real Name 1",
  email: "",
  timeZone: "",
  teams: [],
};

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

const groupMessage: ChannelType = {
  id: "C-222222",
  type: "group_message",
  name: "Group message",
  users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
};
const privateChannel: ChannelType = {
  id: "C-333333",
  type: "private_channel",
  name: "Private channel",
  users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  isStarred: true,
};
const directMessage_1: ChannelType = {
  id: "D-111111",
  type: "direct_message",
  name: "Direct message 1",
  users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  isStarred: true,
  partner: user_1,
};
const directMessage_2: ChannelType = {
  id: "D-222222",
  type: "direct_message",
  name: "Direct message 2",
  users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  isStarred: true,
  partner: user_2,
};

const message_1: MessageType = {
  id: "message_1",
  type: "message",
  delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
  user: "U-o29OsxUsn",
  team: "T-Z4ijiEVH4",
  reactions: {},
  files: [],
  createdTime: 1651942800008,
  updatedTime: 1651942800008,
};

beforeEach(() => {
  store.dispatch(setMessageSocket(messageSocket));
  store.dispatch(setUser(user_1));
  store.dispatch(setChannelUserList([user_1, user_2]));
  store.dispatch(
    setChannelsList([publicChannel, directMessage_1, directMessage_2, groupMessage, privateChannel])
  );
  store.dispatch(setSelectedChannelId(publicChannel.id));
});

describe("Test render", () => {
  test("Render ShareMessageModal", () => {
    customRender(<ShareMessageModal isOpen message={message_1} onClose={() => {}} />);

    expect(screen.getByTestId("MessageInput")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Select a public channel", () => {
    customRender(<ShareMessageModal isOpen message={message_1} onClose={() => {}} />);

    // select public channel
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText(publicChannel.name));
    expect(screen.getByText(publicChannel.name)).toBeInTheDocument();

    // Click to show dropdown
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    expect(screen.getByText("Can't share with more than 1 channel")).toBeInTheDocument();
  });

  test("Select a private channel", () => {
    customRender(<ShareMessageModal isOpen message={message_1} onClose={() => {}} />);

    // select the first dirrect message
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText(privateChannel.name));
    expect(screen.getByText(privateChannel.name)).toBeInTheDocument();

    // Click to show dropdown
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    expect(screen.getByText("Can't share with more than 1 channel")).toBeInTheDocument();
  });

  test("Select a group message", () => {
    customRender(<ShareMessageModal isOpen message={message_1} onClose={() => {}} />);

    // select the first dirrect message
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText(groupMessage.name));
    expect(screen.getByText(groupMessage.name)).toBeInTheDocument();

    // Click to show dropdown
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    expect(screen.getByText("Can't share with more than 1 channel")).toBeInTheDocument();
  });

  test("Select a direct message", () => {
    customRender(<ShareMessageModal isOpen message={message_1} onClose={() => {}} />);

    // select the first dirrect message
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText(user_1.name));
    expect(screen.getByText(directMessage_1.name)).toBeInTheDocument();

    // select the second dirrect message
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText(user_2.name));
    expect(screen.getByText(directMessage_2.name)).toBeInTheDocument();

    // Click to show dropdown
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    expect(screen.getByText("No items")).toBeInTheDocument();
  });

  test("Select a channel and click Clear", () => {
    customRender(<ShareMessageModal isOpen message={message_1} onClose={() => {}} />);

    // select public channel
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText(publicChannel.name));
    expect(screen.getByText(publicChannel.name)).toBeInTheDocument();

    // click Clear
    userEvent.click(screen.getByLabelText("Clear"));
    expect(screen.queryByText(publicChannel.name)).toBeNull();
  });

  test("click Share to a channel", () => {
    const mockOnClose = jest.fn();
    customRender(<ShareMessageModal isOpen message={message_1} onClose={mockOnClose} />);

    // select public channel
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText(publicChannel.name));
    // input message
    userEvent.click(screen.getByTestId("fire-onBlur"));
    // click Share
    userEvent.click(screen.getByText("Share"));

    expect(mockOnClose).toBeCalledWith();
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_SHARE_MESSAGE_TO_CHANNEL, {
      data: {
        toChannelId: publicChannel.id,
        delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
        sharedMessageId: message_1.id,
      },
    });
  });

  test("click Share to multiple user", () => {
    const mockOnClose = jest.fn();
    customRender(<ShareMessageModal isOpen message={message_1} onClose={mockOnClose} />);

    // select direct message 1
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText(user_1.name));
    // select direct message 2
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText(user_2.name));
    // input message
    userEvent.click(screen.getByTestId("fire-onBlur"));
    // click Share
    userEvent.click(screen.getByText("Share"));

    expect(mockOnClose).toBeCalledWith();
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_SHARE_MESSAGE_TO_GROUP_USERS, {
      data: {
        toUserIds: [user_1.id, user_2.id],
        delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
        sharedMessageId: message_1.id,
      },
    });
  });
});
