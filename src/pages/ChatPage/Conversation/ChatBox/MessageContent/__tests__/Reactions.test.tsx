import { screen, customRender, store } from "tests";
import mockIO from "socket.io-client";

// redux slices
import { setUser } from "store/slices/user.slice";
import { setMessageSocket } from "store/slices/socket.slice";

// components
import Reactions from "../Reactions";
import userEvent from "@testing-library/user-event";

// utils
import { SocketEvent } from "utils/constants";

// types
import { EmojiModalProps } from "features/EmojiModal";

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

beforeEach(() => {
  store.dispatch(setUser(userData));
  store.dispatch(setMessageSocket(messageSocket));
});

const reactions = {
  white_check_mark: {
    id: "white_check_mark",
    count: 2,
    users: [userData.id, "anotherUserId"],
  },
  eyes: {
    id: "eyes",
    count: 2,
    users: ["anotherUserId"],
  },
};

describe("Test render", () => {
  test("When has reactions", () => {
    customRender(<Reactions messageId="messageId" reactions={reactions} />);

    expect(screen.getByText("✅")).toBeInTheDocument();
  });

  test("When there are no reaction", () => {
    customRender(<Reactions messageId="messageId" reactions={undefined as any} />);

    // nothing to expect
  });
});

describe("Test actions", () => {
  test("Click on emoji icon", () => {
    customRender(<Reactions messageId="messageId" reactions={reactions} />);

    userEvent.click(screen.getByText("✅"));

    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_REACTION_MESSAGE, {
      data: { id: "messageId", reactionId: "white_check_mark" },
    });
  });

  test("Click on Add reaction and select a emoji icon", () => {
    customRender(<Reactions messageId="messageId" reactions={reactions} />);

    userEvent.click(screen.getByLabelText("Add reaction..."));
    expect(screen.getByTestId("EmojiModal")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("fire-onEmojiSelect"));
    userEvent.click(screen.getByTestId("fire-onClose"));
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_REACTION_MESSAGE, {
      data: { id: "messageId", reactionId: "emoji_id" },
    });
  });
});
