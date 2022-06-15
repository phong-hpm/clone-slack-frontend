// store
import { setupStore } from "store";

// redux action
import { renewAccessToken } from "store/actions/user/renewToken";

// utils
import { apiUrl } from "utils/constants";
import { mockAxios, waitFor } from "__tests__/__setups__";

let store = setupStore();

beforeEach(() => {
  store = setupStore();
  localStorage.setItem("accessToken", "oldToken");
  localStorage.setItem("refreshToken", "oldToken");
});

describe("Test renewAccessToken action", () => {
  test("When successfully", async () => {
    mockAxios.onPost(apiUrl.auth.refreshToken).reply(200, { ok: true, accessToken: "accessToken" });

    await waitFor(() => store.dispatch(renewAccessToken()));

    await waitFor(() => {
      expect(localStorage.getItem("accessToken")).toEqual("accessToken");
      expect(localStorage.getItem("refreshToken")).toEqual("oldToken");
      expect(store.getState().user.accessToken).toEqual("accessToken");
      expect(store.getState().user.isAuth).toBeTruthy();
      expect(store.getState().user.isLoading).toBeFalsy();
    });
  });

  test("When unsuccessfully", async () => {
    mockAxios.onPost(apiUrl.auth.refreshToken).reply(200, { ok: false });

    await waitFor(() => store.dispatch(renewAccessToken()));

    await waitFor(() => {
      expect(localStorage.getItem("accessToken")).toEqual("");
      expect(localStorage.getItem("refreshToken")).toEqual("");
      expect(store.getState().user.accessToken).toEqual("");
      expect(store.getState().user.isAuth).toBeFalsy();
      expect(store.getState().user.isLoading).toBeFalsy();
    });
  });

  test("When error", async () => {
    mockAxios.onPost(apiUrl.auth.refreshToken).reply(402);

    await waitFor(() => store.dispatch(renewAccessToken()));

    await waitFor(() => {
      expect(localStorage.getItem("accessToken")).toEqual("");
      expect(localStorage.getItem("refreshToken")).toEqual("");
      expect(store.getState().user.accessToken).toEqual("");
      expect(store.getState().user.isAuth).toBeFalsy();
      expect(store.getState().user.isLoading).toBeFalsy();
    });
  });
});
