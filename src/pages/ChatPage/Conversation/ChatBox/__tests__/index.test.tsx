import { screen } from "@testing-library/react";
import mockIO from "socket.io-client";
import userEvent from "@testing-library/user-event";

// redux slices
import { setUser } from "store/slices/user.slice";
import { setDayMessageList, setLoading } from "store/slices/messages.slice";
import { setMessageSocket } from "store/slices/socket.slice";

// components
import MessageContentList from "..";

// utils
import { customRender, store } from "tests";
import { SocketEvent } from "utils/constants";

// types
import { Delta } from "quill";
import { ChannelType } from "store/slices/_types";
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";
import { setTeamUserList } from "store/slices/teamUsers.slice";

jest.mock("../MessageContent", () => () => <div>MessageContent</div>);

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
  day_1: { day: "Tuesday, Feb 1st" },
  day_2: { day: "Saturday, May 7th" },
  message_1: {
    id: "message_1",
    type: "message",
    delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
    user: "U-o29OsxUsn",
    team: "T-Z4ijiEVH4",
    reactions: {},
    files: [],
    createdTime: 1651942800008,
    updatedTime: 1651942800008,
  },
  message_2: {
    id: "message_2",
    type: "message",
    delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
    user: "U-o29OsxUsn",
    team: "T-Z4ijiEVH4",
    reactions: {},
    files: [],
    createdTime: 1651942800009,
    updatedTime: 1651942800009,
  },
  message_3: {
    id: "message_3",
    delta: { ops: [{ insert: "a\n" }] } as unknown as Delta,
    reactions: {
      eyes: { id: "eyes", users: ["U-o29OsxUsn"], count: 1 },
      white_check_mark: { id: "white_check_mark", users: ["U-HTtW5jrA7"], count: 1 },
    },
    type: "message",
    user: "U-o29OsxUsn",
    team: "T-Z4ijiEVH4",
    createdTime: 1652001447387,
    updatedTime: 1655033072987,
    files: [],
    isStarred: true,
  },
  userOwner_1: {
    id: "userOwner_1",
    name: "Phong Ho",
    realname: "Phong Hồ",
    email: "phonghophamminh@gmail.com",
    timeZone: "",
    avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
    isOnline: true,
  },
  userOwner_2: {
    id: "userOwner_2",
    name: "Phong Ho",
    realname: "Phong Hồ",
    email: "phonghophamminh@gmail.com",
    timeZone: "",
    avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
    isOnline: true,
  },
};

const dayMessages = [
  messageData.day_1,
  { message: messageData.message_1, userOwner: messageData.userOwner_1 },
  { message: messageData.message_2 },
  messageData.day_2,
  { message: messageData.message_3, userOwner: messageData.userOwner_2 },
];

beforeEach(() => {
  store.dispatch(setChannelsList([channelData]));
  store.dispatch(setSelectedChannelId(channelData.id));
  store.dispatch(setTeamUserList([user_1]));
  store.dispatch(setMessageSocket(messageSocket));
  store.dispatch(setUser(user_1));
  store.dispatch(setDayMessageList({ hasMore: false, dayMessages }));
});

describe("Test render", () => {
  test("When messages are loading", () => {
    store.dispatch(setLoading(true));
    customRender(<MessageContentList />);

    expect(screen.queryByText("MessageContent")).toBeNull();
  });

  test("When messages are loaded", () => {
    store.dispatch(setSelectedChannelId("")); // coverage
    customRender(<MessageContentList />);

    expect(screen.getAllByText("MessageContent")).toHaveLength(3);
  });

  test("When has more", () => {
    Object.defineProperty(HTMLElement.prototype, "clientHeight", { value: 150 });
    store.dispatch(setDayMessageList({ hasMore: true, dayMessages }));

    customRender(<MessageContentList />);

    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_LOAD_MORE_MESSAGES, {
      data: { limit: 10 },
    });
  });
});

describe("Test MessageContentPanel", () => {
  describe("Test render", () => {
    test("When a public channel was selected", () => {
      store.dispatch(setChannelsList([{ ...channelData, type: "public_channel" }]));
      customRender(<MessageContentList />);

      // Label
      expect(screen.getByText(/You're looking at the/)).toBeInTheDocument();
      expect(screen.getByText(channelData.name)).toBeInTheDocument();
      // Description
      expect(
        screen.getByText(
          "This is the one channel that will always include everyone. It's a great spot for announcements and team-wide conversations."
        )
      ).toBeInTheDocument();
    });

    test("When a private channel was selected", () => {
      store.dispatch(setChannelsList([{ ...channelData, type: "private_channel" }]));
      customRender(<MessageContentList />);

      // Label
      expect(screen.getByText(/This is the very beginning of the/)).toBeInTheDocument();
      // Description
      expect(
        screen.getByText(
          "You created this channel on May 29th. It's private, and can only be joined by invitation."
        )
      ).toBeInTheDocument();
    });

    test("When a direct message was selected", () => {
      store.dispatch(setChannelsList([{ ...channelData, type: "direct_message" }]));
      customRender(<MessageContentList />);

      // Label
      expect(
        screen.getByText("This conversation is just between the two of you")
      ).toBeInTheDocument();
      // Description
      expect(
        screen.getByText(/Here you can send messages and share files with/)
      ).toBeInTheDocument();
    });

    test("When a group message was selected", () => {
      store.dispatch(setChannelsList([{ ...channelData, type: "group_message" }]));
      customRender(<MessageContentList />);

      // Label
      expect(
        screen.getByText("This is the very beginning of your group conversation")
      ).toBeInTheDocument();
      // Description
      expect(
        screen.getByText("You'll be notified for every new message in this conversation.")
      ).toBeInTheDocument();
    });
  });

  describe("Test actions", () => {
    test("Click edit description when a public channel was selected", () => {
      store.dispatch(
        setChannelsList([{ ...channelData, desc: "old desc", type: "public_channel" }])
      );
      customRender(<MessageContentList />);

      userEvent.click(screen.getByText("Edit description"));
      expect(store.getState().globalModal.isOpenEditChannelDescriptionModal).toBeTruthy();
    });

    test("Click edit description when a private channel was selected", () => {
      store.dispatch(
        setChannelsList([{ ...channelData, desc: "old desc", type: "private_channel" }])
      );
      customRender(<MessageContentList />);

      userEvent.click(screen.getByText("Edit description"));
      expect(store.getState().globalModal.isOpenEditChannelDescriptionModal).toBeTruthy();
    });

    test("Click add user", () => {
      store.dispatch(
        setChannelsList([{ ...channelData, desc: "old desc", type: "group_message" }])
      );
      customRender(<MessageContentList />);

      userEvent.click(screen.getByText("Add people"));
      expect(store.getState().globalModal.isOpenAddUserChannel).toBeTruthy();
    });
  });
});

describe("Test actions", () => {
  test("Click to show/hide Jump menu", () => {
    customRender(<MessageContentList />);

    userEvent.click(screen.getByText(messageData.day_1.day));
    expect(screen.getByText("Jump to...")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("Yesterday")).toBeInTheDocument();
    expect(screen.getByText("Last Week")).toBeInTheDocument();
    expect(screen.getByText("Last Month")).toBeInTheDocument();
    expect(screen.getByText("The very begining")).toBeInTheDocument();
    expect(screen.getByText("Jump to a specific date")).toBeInTheDocument();

    userEvent.keyboard("{esc}");
    expect(screen.queryByText("Jump to...")).toBeNull();
  });
});
