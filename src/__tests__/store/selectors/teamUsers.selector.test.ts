// store
import { setupStore } from "store";

// redux slices
import { setTeamUserList } from "store/slices/teamUsers.slice";

// redux selectors
import teamUsersSelectors from "store/selectors/teamUsers.selector";

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
  store.dispatch(setTeamUserList([userData]));
});

describe("Test teamUsersSelectors", () => {
  test("Test getTeamUserList", () => {
    const data = teamUsersSelectors.getTeamUserList(store.getState());
    expect(data).toEqual([userData]);
  });
});
