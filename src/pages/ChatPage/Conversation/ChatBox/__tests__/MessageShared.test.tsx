import { screen } from "@testing-library/react";

// redux slices
import { setUser } from "store/slices/user.slice";
import { setChannelUserList } from "store/slices/channelUsers.slice";

// components
import MessageShared from "../MessageShared";

// utils
import { customRender, store } from "tests";

// types
import { Delta } from "quill";

jest.mock("../MessageContent", () => () => <div>MessageContent</div>);

const user_1 = {
  id: "U-111111111",
  name: "User 1",
  realname: "User Real Name 1",
  email: "",
  timeZone: "",
  teams: [],
};

const message_1 = {
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
  store.dispatch(setUser(user_1));
  store.dispatch(setChannelUserList([user_1]));
});

describe("Test render", () => {
  test("Render MessageShared", () => {
    customRender(<MessageShared message={message_1} />);

    expect(screen.getByText("MessageContent")).toBeInTheDocument();
  });
});
