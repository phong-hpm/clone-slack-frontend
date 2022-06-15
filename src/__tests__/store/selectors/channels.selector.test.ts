// store
import { setupStore } from "store";

// redux slices
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";

// redux selectors
import channelsSelectors from "store/selectors/channels.selector";

// types
import { ChannelType } from "store/slices/_types";

let store = setupStore();

const publicChannel: ChannelType = {
  id: "C-111111",
  type: "public_channel",
  name: "general",
  users: [],
  creator: "U-o29OsxUsn",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  topic: "Channel topic",
  unreadMessageCount: 79,
};

beforeEach(() => {
  store = setupStore();
  store.dispatch(setChannelsList([publicChannel]));
  store.dispatch(setSelectedChannelId(publicChannel.id));
});

describe("Test channelsSelectors", () => {
  test("Test isLoading", () => {
    const data = channelsSelectors.isLoading(store.getState());
    expect(data).toBeFalsy();
  });

  test("Test getChannelList", () => {
    const data = channelsSelectors.getChannelList(store.getState());
    expect(data).toEqual([publicChannel]);
  });

  test("Test getUnreadMessageCount when channel's unreadMessageCount is undefined", () => {
    store.dispatch(
      setChannelsList([{ ...publicChannel, unreadMessageCount: undefined as unknown as number }])
    );
    const data = channelsSelectors.getUnreadMessageCount(store.getState());
    expect(data).toEqual(0);
  });

  test("Test getUnreadMessageCount", () => {
    const data = channelsSelectors.getUnreadMessageCount(store.getState());
    expect(data).toEqual(publicChannel.unreadMessageCount);
  });
});
