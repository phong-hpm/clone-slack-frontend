import { screen } from "@testing-library/react";

// redux slices
import { setUser } from "store/slices/user.slice";
import { setChannelsList } from "store/slices/channels.slice";

// components
import WorkSpace from "..";

// utils
import { customRender, history, store } from "tests";

// types
import { ChannelType, UserType } from "store/slices/_types";

jest.mock("pages/ChatPage/WorkSpace/Channel", () => () => <div>Channel</div>);

const userData: UserType = {
  id: "U-o29OsxUsn",
  name: "Phong Ho",
  realname: "Phong Ho Pham Minh",
  email: "phonghophamminh@gmail.com",
  timeZone: "",
  avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
  workspaceUrl: "phonghoworkspace.slack.com",
};

const channelData: ChannelType = {
  id: "C-YHAtcdvh00",
  type: "public_channel",
  name: "general",
  users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
};

beforeEach(() => {
  store.dispatch(setUser(userData));
  history.push("/C-123456789");
});

describe("Test render", () => {
  test("When channel list is empty", () => {
    customRender(<WorkSpace />);

    expect(store.getState().channels.selectedId).toEqual("");
    expect(screen.getByText("Channel")).toBeInTheDocument();
  });

  test("When channel list has values", () => {
    store.dispatch(setChannelsList([channelData]));

    customRender(<WorkSpace />);

    expect(store.getState().channels.selectedId).toEqual(channelData.id);
    expect(screen.getByText("Channel")).toBeInTheDocument();
  });
});
