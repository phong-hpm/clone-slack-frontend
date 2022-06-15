// store
import { setupStore } from "store";

// redux action
import { signout } from "store/actions/user/signout";

// utils
import { waitFor } from "__tests__/__setups__";

let store = setupStore();

beforeEach(() => {
  store = setupStore();
  localStorage.setItem("accessToken", "oldToken");
  localStorage.setItem("refreshToken", "oldToken");
  localStorage.setItem("updatedTime", "updatedTime");
});

test("Test signout action", async () => {
  await waitFor(() => store.dispatch(signout()));

  await waitFor(() => {
    expect(localStorage.getItem("accessToken")).toEqual(null);
    expect(localStorage.getItem("refreshToken")).toEqual(null);
    expect(localStorage.getItem("updatedTime")).toEqual(null);
    expect(store.getState().user.accessToken).toEqual("");
    expect(store.getState().user.refreshToken).toEqual("");
    expect(store.getState().user.isAuth).toBeFalsy();
    expect(store.getState().user.isLoading).toBeFalsy();
  });
});
