import mockIO from "socket.io-client";

// store
import { setupStore } from "store";

// redux slices
import { setChannelSocket, setMessageSocket } from "store/slices/socket.slice";

// redux selectors
import socketSelectors from "store/selectors/socket.selector";

let store = setupStore();
const channelSocket = mockIO();
const messageSocket = mockIO();

beforeEach(() => {
  store = setupStore();
  store.dispatch(setChannelSocket(channelSocket));
  store.dispatch(setMessageSocket(messageSocket));
});

describe("Test socketSelectors", () => {
  test("Test getChannelSocket", () => {
    const data = socketSelectors.getChannelSocket(store.getState());
    expect(data).toEqual(channelSocket);
  });

  test("Test getMessageSocket", () => {
    const data = socketSelectors.getMessageSocket(store.getState());
    expect(data).toEqual(messageSocket);
  });
});
