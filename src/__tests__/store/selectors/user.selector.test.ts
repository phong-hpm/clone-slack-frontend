// store
import { setupStore } from "store";

// redux slices
import { setEmailVerifying, setTokens, setUser } from "store/slices/user.slice";

// redux selectors
import userSelectors from "store/selectors/user.selector";

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
  store.dispatch(setUser(userData));
  store.dispatch(setTokens({ accessToken: "accessToken", refreshToken: "refreshToken" }));
  store.dispatch(setEmailVerifying("phonghophamminh@gmail.com"));
});

describe("Test userSelectors", () => {
  test("Test isAuth", () => {
    const data = userSelectors.isAuth(store.getState());
    expect(data).toBeTruthy();
  });

  test("Test isLoading", () => {
    const data = userSelectors.isLoading(store.getState());
    expect(data).toBeFalsy();
  });

  test("Test getAccessToken", () => {
    const data = userSelectors.getAccessToken(store.getState());
    expect(data).toEqual("accessToken");
  });

  test("Test getRefreshToken", () => {
    const data = userSelectors.getRefreshToken(store.getState());
    expect(data).toEqual("refreshToken");
  });

  test("Test getEmailVerifying", () => {
    const data = userSelectors.getEmailVerifying(store.getState());
    expect(data).toEqual("phonghophamminh@gmail.com");
  });

  test("Test getUser", () => {
    const data = userSelectors.getUser(store.getState());
    expect(data).toEqual(userData);
  });

  test("Test getUserId", () => {
    const data = userSelectors.getUserId(store.getState());
    expect(data).toEqual(userData.id);
  });
});
