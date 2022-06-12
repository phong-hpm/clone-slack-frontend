import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// redux slices
import { setUser } from "store/slices/user.slice";
import { setChannelsList, setSelectedChannelId, updateChannel } from "store/slices/channels.slice";

// components
import MemberTab from "../MemberTab";

// utils
import { store, customRender } from "tests";

// types
import { ChannelType } from "store/slices/_types";
import { setTeamUserList } from "store/slices/teamUsers.slice";

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
  store.dispatch(setTeamUserList([user_1, user_2]));
  store.dispatch(setChannelsList([publicChannel]));
  store.dispatch(setSelectedChannelId(publicChannel.id));
  // channelUsers will be updated automatically
});

describe("Test render", () => {
  test("When no channel was selected", () => {
    store.dispatch(setSelectedChannelId(""));
    customRender(<MemberTab />);

    expect(screen.queryByPlaceholderText("Find members")).toBeNull();
  });

  test("When a public channel was selected", () => {
    customRender(<MemberTab />);

    expect(screen.getByPlaceholderText("Find members")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click Add people", () => {
    customRender(<MemberTab />);

    userEvent.click(screen.getByText("Add people"));
    expect(store.getState().globalModal.isOpenAddUserChannel).toBeTruthy();
  });

  test("Click clear search value", () => {
    customRender(<MemberTab />);

    const inputEl = screen.queryByPlaceholderText("Find members")!;
    userEvent.type(inputEl, "urn1");
    expect(inputEl).toHaveValue("urn1");

    // Click to clear search value
    userEvent.click(within(inputEl.nextElementSibling as HTMLElement).getByRole("button"));
    expect(inputEl).toHaveValue("");
  });

  test("Input value which match with users who is in this channel only", () => {
    customRender(<MemberTab />);

    const inputEl = screen.queryByPlaceholderText("Find members")!;
    userEvent.type(inputEl, "urn1");
    expect(screen.queryByText("Add people")).toBeNull();
    expect(screen.getByText("In this channel")).toBeInTheDocument();
    expect(screen.queryByText("Not in this channel")).toBeNull();
  });

  test("Input value which match with users who is NOT in this channel", () => {
    customRender(<MemberTab />);

    userEvent.type(screen.queryByPlaceholderText("Find members")!, "urn2");
    expect(screen.getByText("Add people")).toBeInTheDocument();
    expect(screen.queryByText("In this channel")).toBeNull();
    expect(screen.getByText("Not in this channel")).toBeInTheDocument();
  });

  test("Input value which match with all users", () => {
    customRender(<MemberTab />);

    userEvent.type(screen.queryByPlaceholderText("Find members")!, "urn");
    expect(screen.getByText("Add people")).toBeInTheDocument();
    expect(screen.getByText("In this channel")).toBeInTheDocument();
    expect(screen.getByText("Not in this channel")).toBeInTheDocument();
  });

  test("Input value which doesn't match with any users", () => {
    customRender(<MemberTab />);

    userEvent.type(screen.queryByPlaceholderText("Find members")!, "wrong-search");
    expect(screen.queryByText("In this channel")).toBeNull();
    expect(screen.queryByText("Not in this channel")).toBeNull();
    expect(screen.getByText("No matches found for wrong-search")).toBeInTheDocument();
    expect(screen.getByText("Add people")).toBeInTheDocument();

    userEvent.click(screen.getByText("Add people"));
    expect(store.getState().globalModal.isOpenAddUserChannel).toBeTruthy();
  });
});
