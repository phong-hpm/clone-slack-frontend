// store
import { setupStore } from "store";

// redux action
import { confirmEmailCode } from "store/actions/user/confirmEmailCode";

// utils
import { apiUrl } from "utils/constants";
import { mockAxios, waitFor } from "__tests__/__setups__";

let store = setupStore();

beforeEach(() => {
  store = setupStore();
  localStorage.setItem("accessToken", "oldToken");
  localStorage.setItem("refreshToken", "oldToken");
});

describe("Test confirmEmailCode action", () => {
  test("When successfully", async () => {
    const email = "phonghophamminh@gmail.com";
    mockAxios
      .onPost(apiUrl.auth.confirmEmailCode)
      .reply(200, { ok: true, accessToken: "accessToken", refreshToken: "refreshToken" });

    await waitFor(() => store.dispatch(confirmEmailCode({ email, verifyCode: "111111" })));

    await waitFor(() => {
      expect(localStorage.getItem("accessToken")).toEqual("accessToken");
      expect(localStorage.getItem("refreshToken")).toEqual("refreshToken");
      expect(store.getState().user.accessToken).toEqual("accessToken");
      expect(store.getState().user.refreshToken).toEqual("refreshToken");
      expect(store.getState().user.emailVerifying).toEqual("");
      expect(store.getState().user.isAuth).toBeTruthy();
      expect(store.getState().user.isLoading).toBeFalsy();
    });
  });

  test("When unsuccessfully", async () => {
    const email = "phonghophamminh@gmail.com";
    mockAxios.onPost(apiUrl.auth.confirmEmailCode).reply(200, { ok: false, email: "" });

    await waitFor(() => store.dispatch(confirmEmailCode({ email, verifyCode: "111111" })));

    await waitFor(() => {
      expect(localStorage.getItem("accessToken")).toEqual("oldToken");
      expect(localStorage.getItem("refreshToken")).toEqual("oldToken");
      expect(store.getState().user.accessToken).toEqual("");
      expect(store.getState().user.refreshToken).toEqual("");
      expect(store.getState().user.emailVerifying).toEqual("");
      expect(store.getState().user.isAuth).toBeFalsy();
      expect(store.getState().user.isLoading).toBeFalsy();
    });
  });

  test("When error", async () => {
    const email = "phonghophamminh@gmail.com";
    mockAxios.onPost(apiUrl.auth.confirmEmailCode).reply(402);

    await waitFor(() => store.dispatch(confirmEmailCode({ email, verifyCode: "111111" })));

    await waitFor(() => {
      expect(localStorage.getItem("accessToken")).toEqual("");
      expect(localStorage.getItem("refreshToken")).toEqual("");
      expect(store.getState().user.accessToken).toEqual("");
      expect(store.getState().user.refreshToken).toEqual("");
      expect(store.getState().user.emailVerifying).toEqual("");
      expect(store.getState().user.isAuth).toBeFalsy();
      expect(store.getState().user.isLoading).toBeFalsy();
    });
  });
});
