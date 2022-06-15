// store
import { setupStore } from "store";

// redux slices
import { setChannelUserList } from "store/slices/channelUsers.slice";

// redux selectors
import channelUsersSelectors from "store/selectors/channelUsers.selector";

// types
import { UserType } from "store/slices/_types";

let store = setupStore();

const userData: UserType = {
  id: "U-o29OsxUsn",
  name: "Phong Ho",
  realname: "Phong Ho Pham Minh",
  email: "phonghophamminh@gmail.com",
  timeZone: "",
  avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
};

beforeEach(() => {
  store = setupStore();
  store.dispatch(setChannelUserList([userData]));
});

describe("Test channelUsersSelectors", () => {
  test("Test getChannelUserList", () => {
    const data = channelUsersSelectors.getChannelUserList(store.getState());
    expect(data).toEqual([userData]);
  });

  test("Test getChannelUserById", () => {
    const data = channelUsersSelectors.getChannelUserById(store.getState(), userData.id);
    expect(data).toEqual(userData);
  });
});
