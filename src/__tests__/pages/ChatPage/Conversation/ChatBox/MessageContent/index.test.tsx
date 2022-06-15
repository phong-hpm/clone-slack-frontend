import { screen } from "@testing-library/react";
import mockIO from "socket.io-client";
import userEvent from "@testing-library/user-event";

// redux slices
import { setUser } from "store/slices/user.slice";
import { setMessageSocket } from "store/slices/socket.slice";
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";
import { setTeamUserList } from "store/slices/teamUsers.slice";

// components
import MessageContent from "pages/ChatPage/Conversation/ChatBox/MessageContent";

// utils
import { customRender, store } from "__tests__/__setups__";
import { SocketEvent } from "utils/constants";

// types
import { Delta } from "quill";
import { ChannelType, MessageFileType, MessageType } from "store/slices/_types";
import { MessageActionsProps } from "pages/ChatPage/Conversation/ChatBox/MessageActions";
import { MessageInputProps } from "pages/ChatPage/Conversation/ChatBox/MessageInput";

jest.mock("pages/ChatPage/Conversation/ChatBox/MessageInput", () => (props: MessageInputProps) => (
  <div data-testid="MessageInput">
    <div data-testid="fire-onCancel" onClick={() => props.onCancel?.()} />
    <div
      data-testid="fire-onSend"
      onClick={() => {
        props.onSend?.({ ops: [{ insert: "updated text 1\n" }] } as unknown as Delta, []);
      }}
    />
  </div>
));
jest.mock("pages/ChatPage/Conversation/ChatBox/MessageContent/MediaFileList", () => () => (
  <div data-testid="MediaFileList" />
));
jest.mock("pages/ChatPage/Conversation/ChatBox/MessageContent/Bookmark", () => () => (
  <div data-testid="Bookmark" />
));
jest.mock("pages/ChatPage/Conversation/ChatBox/MessageContent/Reactions", () => () => (
  <div data-testid="Reactions" />
));
jest.mock(
  "pages/ChatPage/Conversation/ChatBox/MessageActions",
  () => (props: MessageActionsProps) =>
    (
      <div data-testid="MessageActions">
        <div
          data-testid="fire-onClickShare"
          onClick={() => {
            props.onClickShare();
            props.onClose();
          }}
        />
        <div
          data-testid="fire-onClickEdit"
          onClick={() => {
            props.onClickEdit();
            props.onClose();
          }}
        />
        <div
          data-testid="fire-onClickDelete"
          onClick={() => {
            props.onClickDelete();
            props.onClose();
          }}
        />
      </div>
    )
);

const messageSocket = mockIO();

const user = {
  id: "U-o29OsxUsn",
  name: "User 1",
  realname: "User Real Name 1",
  email: "",
  timeZone: "",
  teams: [],
};

const channelData: ChannelType = {
  id: "C-111111",
  type: "public_channel",
  name: "general",
  users: [user.id],
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  topic: "Channel topic",
  unreadMessageCount: 79,
};

const message_1: MessageType = {
  id: "message_1",
  type: "message",
  delta: { ops: [{ insert: "message text 1\n" }] } as unknown as Delta,
  user: "U-o29OsxUsn",
  team: "T-Z4ijiEVH4",
  createdTime: 1651942800008,
  updatedTime: 1651942800008,
  files: [{ id: "fileId" } as unknown as MessageFileType],
  reactions: {
    white_check_mark: {
      id: "white_check_mark",
      users: Array.from({ length: 99 }, (_, index) => `user_${index + 1}`),
      count: 99,
    },
  },
  isStarred: true,
};
const message_2: MessageType = {
  id: "message_2",
  type: "message",
  delta: { ops: [{ insert: "message text 2\n" }] } as unknown as Delta,
  user: "U-o29OsxUsn",
  team: "T-Z4ijiEVH4",
  reactions: {},
  files: [],
  createdTime: 1651942800009,
  updatedTime: 1651942800009,
};

beforeEach(() => {
  store.dispatch(setChannelsList([channelData]));
  store.dispatch(setSelectedChannelId(channelData.id));
  store.dispatch(setTeamUserList([user]));
  store.dispatch(setMessageSocket(messageSocket));
  store.dispatch(setUser(user));
});

describe("Test render", () => {
  test("Render MessageContent", () => {
    customRender(<MessageContent message={message_1} />);

    expect(screen.getByText("message text 1")).toBeInTheDocument();
    expect(screen.getByTestId("Bookmark")).toBeInTheDocument();
    expect(screen.getByTestId("MediaFileList")).toBeInTheDocument();
    expect(screen.getByTestId("Reactions")).toBeInTheDocument();
  });

  test("When not starred", () => {
    customRender(<MessageContent message={{ ...message_1, isStarred: false }} />);

    expect(screen.getByText("message text 1")).toBeInTheDocument();
    expect(screen.queryByTestId("Bookmark")).toBeNull();
    expect(screen.getByTestId("MediaFileList")).toBeInTheDocument();
    expect(screen.getByTestId("Reactions")).toBeInTheDocument();
  });

  test("When have no reaction", () => {
    customRender(<MessageContent message={{ ...message_1, reactions: {} }} />);

    expect(screen.getByText("message text 1")).toBeInTheDocument();
    expect(screen.getByTestId("Bookmark")).toBeInTheDocument();
    expect(screen.getByTestId("MediaFileList")).toBeInTheDocument();
    expect(screen.queryByTestId("Reactions")).toBeNull();
  });

  test("When have no file", () => {
    customRender(<MessageContent message={{ ...message_1, files: [] }} />);

    expect(screen.getByText("message text 1")).toBeInTheDocument();
    expect(screen.getByTestId("Bookmark")).toBeInTheDocument();
    expect(screen.queryByTestId("MediaFileList")).toBeNull();
    expect(screen.getByTestId("Reactions")).toBeInTheDocument();
  });

  test("When teamUser is empty", () => {
    store.dispatch(setTeamUserList([]));
    customRender(<MessageContent message={message_1} />);

    expect(screen.queryByText("message text 1")).toBeNull();
  });

  test("When mesage has a shared message", () => {
    customRender(
      <MessageContent message={{ ...message_1, isStarred: true, sharedMessage: message_2 }} />
    );

    expect(screen.getByText("message text 1")).toBeInTheDocument();
    expect(screen.getByText("message text 2")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Hover on message", () => {
    customRender(<MessageContent message={{ ...message_1, isStarred: false }} />);

    // hover to show actions
    userEvent.hover(screen.getByText("message text 1"));
    expect(screen.getByTestId("MessageActions")).toBeInTheDocument();

    // hover to hide actions
    userEvent.unhover(screen.getByText("message text 1"));
    expect(screen.queryByTestId("MessageActions")).toBeNull();
  });

  test("Click on user owner", async () => {
    customRender(<MessageContent message={message_1} userOwner={user} />);

    // click more actions
    userEvent.click(document.getElementsByTagName("img")[0]);
    expect(screen.getAllByText(user.name)).toHaveLength(2);

    // Press esc to close
    userEvent.keyboard("{esc}");
    expect(screen.getAllByText(user.name)).toHaveLength(1);
  });

  test("Share message", async () => {
    customRender(<MessageContent message={message_1} />);

    // hover to show actions
    userEvent.hover(screen.getByText("message text 1"));
    // click more actions
    userEvent.click(screen.getByTestId("fire-onClickShare"));
    expect(screen.getByText("Share this message")).toBeInTheDocument();

    // ShareMessageModal will be tested in another test suit, just try to open and close it
    // Press esc to close
    userEvent.keyboard("{esc}");
    expect(screen.queryByText("Share this message")).toBeNull();
  });

  test("Delete message", async () => {
    customRender(<MessageContent message={message_1} />);

    // hover to show actions
    userEvent.hover(screen.getByText("message text 1"));
    // click more actions
    userEvent.click(screen.getByTestId("fire-onClickDelete"));
    // Press enter to submit delete
    userEvent.keyboard("{Enter}");

    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_REMOVE_MESSAGE, {
      data: { id: message_1.id },
    });
  });

  test("Edit message and cancel", async () => {
    customRender(<MessageContent message={message_1} />);

    // hover to show actions
    userEvent.hover(screen.getByText("message text 1"));
    // click more actions
    userEvent.click(screen.getByTestId("fire-onClickEdit"));

    expect(screen.getByTestId("MessageInput")).toBeInTheDocument();
    expect(screen.queryByTestId("Bookmark")).toBeNull();
    expect(screen.queryByTestId("MediaFileList")).toBeNull();
    expect(screen.queryByTestId("Reactions")).toBeNull();

    // update message
    userEvent.click(screen.getByTestId("fire-onCancel"));

    expect(screen.queryByTestId("MessageInput")).toBeNull();
    expect(messageSocket.emit).not.toBeCalled();
  });

  test("Edit message and send", async () => {
    customRender(<MessageContent message={message_1} />);

    // hover to show actions
    userEvent.hover(screen.getByText("message text 1"));
    // click more actions
    userEvent.click(screen.getByTestId("fire-onClickEdit"));

    expect(screen.getByTestId("MessageInput")).toBeInTheDocument();
    expect(screen.queryByTestId("Bookmark")).toBeNull();
    expect(screen.queryByTestId("MediaFileList")).toBeNull();
    expect(screen.queryByTestId("Reactions")).toBeNull();

    // update message
    userEvent.click(screen.getByTestId("fire-onSend"));

    expect(screen.queryByTestId("MessageInput")).toBeNull();
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_EDIT_MESSAGE, {
      data: { id: message_1.id, delta: { ops: [{ insert: "updated text 1\n" }] } },
    });
  });
});
