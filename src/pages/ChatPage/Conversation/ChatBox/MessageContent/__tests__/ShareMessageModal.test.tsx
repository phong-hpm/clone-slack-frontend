import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

// redux slices
import { setChannelsList } from "store/slices/channels.slice";
import { setUser } from "store/slices/user.slice";

// components
import ShareMessageModal from "../ShareMessageModal";
import mockIO from "socket.io-client";

// utils
import { customRender, store } from "tests";

// types
import { Delta } from "quill";
import { ChannelType } from "store/slices/_types";
import { setMessageSocket } from "store/slices/socket.slice";
import { SocketEvent } from "utils/constants";
import { MessageInputProps } from "../../MessageInput";

jest.mock("../../MessageShared", () => () => <div>MessageShared</div>);
jest.mock("../../MessageInput", () => (props: MessageInputProps) => (
  <div data-testid="MessageInput">
    <div
      data-testid="fire-onBlur"
      onClick={() => props.onBlur?.({ ops: [{ insert: "hello\n" }] } as Delta)}
    />
  </div>
));

const messageSocket = mockIO();

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

const userPartner_1 = {
  id: "U-111111",
  name: "Partner 1",
  realname: "",
  email: "",
  timeZone: "",
  teams: [],
  avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
  createdTime: 1653589513216,
  updatedTime: 1653589513216,
};

const userPartner_2 = {
  id: "U-222222",
  name: "Partner 2",
  realname: "",
  email: "",
  timeZone: "",
  teams: [],
  avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
  createdTime: 1653589513216,
  updatedTime: 1653589513216,
};

const messageData = {
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
const publicChannel: ChannelType = {
  id: "C-111111",
  type: "public_channel",
  name: "general",
  users: [userData.id],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
};
const privateChannel: ChannelType = {
  id: "C-222222",
  type: "private_channel",
  name: "private channel",
  users: [userData.id],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
};
const groupMessage: ChannelType = {
  id: "G-111111",
  type: "group_message",
  name: "group message",
  users: [userData.id],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
};
const directMessage_1: ChannelType = {
  id: "D-111111",
  type: "direct_message",
  name: "direct message 1",
  users: [userData.id],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  partner: userPartner_1,
};
const directMessage_2: ChannelType = {
  id: "D-222222",
  type: "direct_message",
  name: "direct message 2",
  users: [userData.id],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  partner: userPartner_2,
};

beforeEach(() => {
  store.dispatch(setMessageSocket(messageSocket));
  store.dispatch(setUser(userData));
  store.dispatch(
    setChannelsList([publicChannel, privateChannel, groupMessage, directMessage_1, directMessage_2])
  );
});

describe("Test render", () => {
  test("Render ShareMessageModal", () => {
    customRender(<ShareMessageModal isOpen message={messageData} onClose={() => {}} />);

    expect(screen.getByText("Share this message")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Select a public channel", () => {
    const mockOnClose = jest.fn();
    customRender(<ShareMessageModal isOpen message={messageData} onClose={mockOnClose} />);

    // Select a channel
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText("general"));

    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    expect(screen.getByText("Can't share with more than 1 channel")).toBeInTheDocument();

    // Click share
    userEvent.click(screen.getByText("Share"));
    expect(mockOnClose).toBeCalledWith();
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_SHARE_MESSAGE_TO_CHANNEL, {
      data: {
        toChannelId: publicChannel.id,
        delta: {},
        sharedMessageId: messageData.id,
      },
    });
  });

  test("Select a group channel", () => {
    const mockOnClose = jest.fn();
    customRender(<ShareMessageModal isOpen message={messageData} onClose={mockOnClose} />);

    // Select a channel
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText("group message"));

    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    expect(screen.getByText("Can't share with more than 1 channel")).toBeInTheDocument();

    // Click share
    userEvent.click(screen.getByText("Share"));
    expect(mockOnClose).toBeCalledWith();
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_SHARE_MESSAGE_TO_CHANNEL, {
      data: {
        toChannelId: groupMessage.id,
        delta: {},
        sharedMessageId: messageData.id,
      },
    });
  });

  test("Select a private channel", () => {
    const mockOnClose = jest.fn();
    customRender(<ShareMessageModal isOpen message={messageData} onClose={mockOnClose} />);

    // Select a channel
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText("private channel"));

    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    expect(screen.getByText("Can't share with more than 1 channel")).toBeInTheDocument();

    // Click share
    userEvent.click(screen.getByText("Share"));
    expect(mockOnClose).toBeCalledWith();
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_SHARE_MESSAGE_TO_CHANNEL, {
      data: {
        toChannelId: privateChannel.id,
        delta: {},
        sharedMessageId: messageData.id,
      },
    });
  });

  test("Select multiple direct messages", () => {
    const mockOnClose = jest.fn();
    customRender(<ShareMessageModal isOpen message={messageData} onClose={mockOnClose} />);

    // Select first direct message
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText("Partner 1"));

    // Select second direct message
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText("Partner 2"));

    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    expect(screen.getByText("No items")).toBeInTheDocument();

    // type some message text
    userEvent.click(screen.getByTestId("fire-onBlur"));

    // Click share
    userEvent.click(screen.getByText("Share"));
    expect(mockOnClose).toBeCalledWith();
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_SHARE_MESSAGE_TO_GROUP_USERS, {
      data: {
        toUserIds: [userPartner_1.id, userPartner_2.id],
        delta: { ops: [{ insert: "hello\n" }] },
        sharedMessageId: messageData.id,
      },
    });
  });

  test("Remove selected channel", () => {
    customRender(<ShareMessageModal isOpen message={messageData} onClose={() => {}} />);

    // Select a channel
    userEvent.click(screen.getByPlaceholderText("Search for channel or person"));
    userEvent.click(screen.getByText("general"));

    // Click remove button
    userEvent.click(screen.getByText("general").parentNode!.nextSibling as HTMLElement);
    expect(screen.queryByText("general")).toBeNull();
  });
});
