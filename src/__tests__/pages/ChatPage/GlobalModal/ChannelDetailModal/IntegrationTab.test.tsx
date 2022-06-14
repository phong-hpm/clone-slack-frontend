import { screen } from "@testing-library/react";

// redux slices
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";

// components
import IntegrationTab from "pages/ChatPage/GlobalModal/ChannelDetailModal/IntegrationTab";

// utils
import { store, customRender } from "__tests__/__setups__";

// types
import { ChannelType } from "store/slices/_types";

const publicChannel: ChannelType = {
  id: "C-111111",
  type: "public_channel",
  name: "general",
  users: ["U-o29OsxUsn", "U-HTtW5jrA7", "U-zcnTpvyLO"],
  creator: "U-123456",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  unreadMessageCount: 79,
};

beforeEach(() => {
  store.dispatch(setChannelsList([publicChannel]));
  store.dispatch(setSelectedChannelId(publicChannel.id));
});

describe("Test render", () => {
  test("When no channel was selected", () => {
    store.dispatch(setSelectedChannelId(""));
    customRender(<IntegrationTab />);

    expect(screen.queryByText("Workflows")).toBeNull();
  });

  test("When a public channel was selected", () => {
    customRender(<IntegrationTab />);

    expect(screen.getByText("Workflows")).toBeInTheDocument();
    expect(screen.getByText("Apps")).toBeInTheDocument();
    expect(screen.getByText("Send emails to this channel")).toBeInTheDocument();
  });
});
