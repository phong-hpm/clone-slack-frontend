import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import mockIO from "socket.io-client";

// utils
import { customRender, store } from "__tests__/__setups__";

// components
import MessageActions, {
  MessageActionsProps,
} from "pages/ChatPage/Conversation/ChatBox/MessageActions";

// types
import { EmojiModalProps } from "features/EmojiModal";
import { Delta } from "quill";
import { ChannelType } from "store/slices/_types";
import { SocketEvent } from "utils/constants";
import { setMessageSocket } from "store/slices/socket.slice";

jest.mock("features/EmojiModal", () => (props: EmojiModalProps) => (
  <div data-testid="EmojiModal">
    <div
      data-testid="fire-onEmojiSelect"
      onClick={() => props.onEmojiSelect({ id: "emoji_id" } as any)}
    />
    <div data-testid="fire-onClose" onClick={() => props.onClose()} />
  </div>
));

const messageSocket = mockIO();

const user_1 = {
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
  users: [user_1.id],
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  topic: "Channel topic",
  unreadMessageCount: 79,
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

const renderComponent = (props?: Partial<MessageActionsProps>) => {
  return customRender(
    <MessageActions
      messageId={messageData.id}
      onClickShare={() => {}}
      onClickDelete={() => {}}
      onClickEdit={() => {}}
      onClose={() => {}}
      {...props}
    />
  );
};

beforeEach(() => {
  store.dispatch(setMessageSocket(messageSocket));
});

describe("Test render", () => {
  test("When message is system", () => {
    renderComponent({ isSystem: true, isStarred: true });

    expect(screen.getByLabelText("Completed")).toBeInTheDocument();
    expect(screen.getByLabelText("Take a look...")).toBeInTheDocument();
    expect(screen.getByLabelText("Nicely done")).toBeInTheDocument();
    expect(screen.getByLabelText("Find another reaction")).toBeInTheDocument();
    expect(screen.queryByLabelText("Realy in thread")).toBeNull();
    expect(screen.getByLabelText("Share message")).toBeInTheDocument();
    expect(screen.getByLabelText("Add to saved item")).toBeInTheDocument();
    expect(screen.getByLabelText("More actions")).toBeInTheDocument();
  });
  test("When message is not system", () => {
    renderComponent({ isSystem: false });

    expect(screen.getByLabelText("Completed")).toBeInTheDocument();
    expect(screen.getByLabelText("Take a look...")).toBeInTheDocument();
    expect(screen.getByLabelText("Nicely done")).toBeInTheDocument();
    expect(screen.getByLabelText("Find another reaction")).toBeInTheDocument();
    expect(screen.getByLabelText("Realy in thread")).toBeInTheDocument();
    expect(screen.getByLabelText("Share message")).toBeInTheDocument();
    expect(screen.getByLabelText("Add to saved item")).toBeInTheDocument();
    expect(screen.getByLabelText("More actions")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click on emoji icons", () => {
    renderComponent();

    userEvent.click(screen.getByLabelText("Completed"));
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_REACTION_MESSAGE, {
      data: { id: messageData.id, reactionId: "white_check_mark" },
    });
    (messageSocket.emit as jest.Mock).mockClear();

    userEvent.click(screen.getByLabelText("Take a look..."));
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_REACTION_MESSAGE, {
      data: { id: messageData.id, reactionId: "eyes" },
    });
    (messageSocket.emit as jest.Mock).mockClear();

    userEvent.click(screen.getByLabelText("Nicely done"));
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_REACTION_MESSAGE, {
      data: { id: messageData.id, reactionId: "raised_hands" },
    });
  });

  test("Click on Find another reaction and select a emoji icon", () => {
    renderComponent();

    userEvent.click(screen.getByLabelText("Find another reaction"));
    expect(screen.getByTestId("EmojiModal"));

    userEvent.click(screen.getByTestId("fire-onEmojiSelect"));
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_REACTION_MESSAGE, {
      data: { id: messageData.id, reactionId: "emoji_id" },
    });

    userEvent.click(screen.getByTestId("fire-onClose")); // coverage
  });

  test("Click on Add to saved item", () => {
    renderComponent();

    userEvent.click(screen.getByLabelText("Add to saved item"));
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_STARRED_MESSAGE, {
      data: { id: messageData.id },
    });
  });

  test("Click on Share message", () => {
    const mockOnClickShare = jest.fn();
    renderComponent({ onClickShare: mockOnClickShare });

    userEvent.click(screen.getByLabelText("Share message"));
    expect(mockOnClickShare).toBeCalledWith(expect.objectContaining({ type: "click" }));
  });

  test("Click on More actions and select a option", () => {
    const mockOnClose = jest.fn();
    renderComponent({ onClose: mockOnClose });

    userEvent.click(screen.getByLabelText("More actions"));
    expect(screen.getByText("Get notified about new replies")).toBeInTheDocument();

    userEvent.click(screen.getByText("Get notified about new replies"));
    expect(screen.queryByText("Get notified about new replies")).toBeNull();
    expect(mockOnClose).toBeCalledWith();
  });
});
