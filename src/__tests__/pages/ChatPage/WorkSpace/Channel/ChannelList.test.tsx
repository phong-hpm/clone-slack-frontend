import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";

// redux slices
import { setSelectedChannelId } from "store/slices/channels.slice";

// components
import ChannelList from "pages/ChatPage/WorkSpace/Channel/ChannelList";

// utils
import { customRender, history, store } from "__tests__/__setups__";
import { routePaths } from "utils/constants";

// types
import { ChannelType } from "store/slices/_types";

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
const directMessage: ChannelType = {
  id: "C-444444",
  type: "direct_message",
  name: "Direct message",
  users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
  unreadMessageCount: 0,
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  isStarred: true,
};

const renderComponent = (data?: {
  selectedChannel?: ChannelType;
  channels?: ChannelType[];
  onClickAdd?: () => void;
}) => {
  const { selectedChannel, channels, onClickAdd } = data || {};

  history.push(`${routePaths.CHATBOX_PAGE}/T-123456789`);
  customRender(
    <ChannelList
      label="Channel label"
      selectedChannel={selectedChannel}
      channels={channels || [publicChannel, groupMessage, privateChannel, directMessage]}
      addText="Add channels"
      onClickAdd={onClickAdd}
    />
  );
};

beforeEach(() => {});

describe("Test render", () => {
  test("When no channel was selected", () => {
    store.dispatch(setSelectedChannelId(""));
    renderComponent({ selectedChannel: publicChannel });

    expect(screen.queryByText("Mentions & reactions")).toBeNull();
  });
});

describe("Test actions", () => {
  test("Click collapse/expand", () => {
    renderComponent({ selectedChannel: publicChannel, channels: [publicChannel] });

    // Click to collapse channels list
    expect(screen.getAllByText(publicChannel.name)).toHaveLength(1);
    userEvent.click(screen.getByText("Channel label"));
    userEvent.unhover(screen.getByText("Channel label"));
    // Because Collapse component hide channels by using css,
    //  so channels still in DOM after collapsed
    expect(screen.getAllByText(publicChannel.name)).toHaveLength(2);

    // Click to expand channels list
    userEvent.click(screen.getByText("Channel label"));
    expect(screen.getAllByText(publicChannel.name)).toHaveLength(1);
  });

  test("Click Add channel", () => {
    const mockOnClickAdd = jest.fn();
    renderComponent({ channels: [publicChannel], onClickAdd: mockOnClickAdd });

    // Click add channel
    userEvent.click(screen.getByText("Add channels"));
    expect(mockOnClickAdd).toBeCalledWith();
  });

  test("Click select channel", () => {
    const mockNavigate = useNavigate();
    renderComponent({ selectedChannel: publicChannel, channels: [publicChannel] });

    // Click add channel
    userEvent.click(screen.getByText(publicChannel.name));
    expect(mockNavigate).toBeCalledWith(`${routePaths.CHATBOX_PAGE}/teamId/${publicChannel.id}`);
  });
});
