// store
import { setupStore } from "store";

// redux action
import { checkEmail } from "store/actions/user/checkEmail";

// utils
import { apiUrl } from "utils/constants";
import { mockAxios, waitFor } from "__tests__/__setups__";

let store = setupStore();

beforeEach(() => {
  store = setupStore();
});

describe("Test checkEmail action", () => {
  test("When successfully", async () => {
    const email = "phonghophamminh@gmail.com";
    mockAxios.onPost(apiUrl.auth.checkEmail).reply(200, { ok: true, email });

    await waitFor(() => store.dispatch(checkEmail({ email })));

    await waitFor(() => {
      expect(store.getState().user.emailVerifying).toEqual(email);
      expect(store.getState().user.isLoading).toBeFalsy();
    });
  });

  test("When unsuccessfully", async () => {
    const email = "phonghophamminh@gmail.com";
    mockAxios.onPost(apiUrl.auth.checkEmail).reply(200, { ok: false, email: "" });

    await waitFor(() => store.dispatch(checkEmail({ email })));

    await waitFor(() => {
      expect(store.getState().user.emailVerifying).toEqual("");
      expect(store.getState().user.isLoading).toBeFalsy();
    });
  });

  test("When error", async () => {
    const email = "phonghophamminh@gmail.com";
    mockAxios.onPost(apiUrl.auth.checkEmail).reply(402);

    await waitFor(() => store.dispatch(checkEmail({ email })));

    await waitFor(() => {
      expect(store.getState().user.emailVerifying).toEqual("");
      expect(store.getState().user.isLoading).toBeFalsy();
    });
  });
});
