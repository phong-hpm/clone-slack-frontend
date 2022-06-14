import { store } from "store";
import MockAdapter from "axios-mock-adapter";

// redux slices
import { setTokens } from "store/slices/user.slice";

// utils
import { apiUrl } from "utils/constants";
import axiosInstance, { setupAxios } from "utils/axios";

const mockGetItem = jest.fn();
const mockSetItem = jest.fn();
const mockRemoveItem = jest.fn();

const mockLocalStorage = {
  key: () => "key",
  length: 0,
  clear: () => {},
  getItem: mockGetItem,
  setItem: mockSetItem,
  removeItem: mockRemoveItem,
};

let mockAxios = new MockAdapter(axiosInstance, { onNoMatch: "throwException" });
mockAxios.onPost(apiUrl.auth.refreshToken).reply(200, { accessToken: "token-newAccessToken" });
// handle for code: resolve(axiosInstance(originalRequest));
mockAxios.onAny().reply(200);

beforeEach(() => {
  setupAxios(store);
});

afterEach(() => {
  jest.resetAllMocks();
  store.dispatch(setTokens({ refreshToken: "", accessToken: "" }));
});

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("interceptors request", () => {
  const handler = (axiosInstance.interceptors.request as any).handlers[0];

  test("When accessToken was not existed", () => {
    mockGetItem.mockImplementation(() => "");
    const result = handler.fulfilled({ headers: {} });

    expect(mockGetItem).toBeCalledWith("accessToken");
    expect(result).toEqual({ headers: {} });
  });

  test("When accessToken existed", () => {
    mockGetItem.mockImplementation(() => "token-accessToken");
    const result = handler.fulfilled({ headers: {} });

    expect(mockGetItem).toBeCalledWith("accessToken");
    expect(result).toEqual({ headers: { "x-access-token": "token-accessToken" } });
  });
});

describe("interceptors response", () => {
  const handler = (axiosInstance.interceptors.response as any).handlers[0];

  test("Fulfilled", async () => {
    mockGetItem.mockImplementation(() => "");
    const result = await handler.fulfilled({ headers: {} });

    expect(result).toEqual({ headers: {} });
  });

  test("Rejected 401, refresh token successfully", async () => {
    let error: any = null;
    // [promise1] will get new accessToken
    const promise1 = handler.rejected({ config: { headers: {} }, response: { status: 401 } });
    // [promise2] will wait for getting accessToken, be pushed to queue
    const promise2 = handler.rejected({ config: { headers: {} }, response: { status: 401 } });

    try {
      await Promise.all([promise1, promise2]);
    } catch (e) {
      error = e;
    }

    expect(error).toBeNull();
    expect(store.getState().user.accessToken).toEqual("token-newAccessToken");
    expect(mockSetItem).toBeCalledWith("accessToken", "token-newAccessToken");
    mockSetItem.mockClear();

    // util now, axios will NOT get a new accessToken, this rejection will throw error
    try {
      await handler.rejected({ config: { headers: {} }, response: { status: 401 } });
    } catch (e) {
      error = e;
    }
    expect(error).toEqual({ config: { headers: {} }, response: { status: 401 } });
    expect(mockSetItem).not.toBeCalled();
  });

  test("Rejected 402", async () => {
    let error: any = null;

    try {
      await handler.rejected({ config: { headers: {} }, response: { status: 402 } });
    } catch (e) {
      error = e;
    }

    expect(error).toEqual({ config: { headers: {} }, response: { status: 402 } });
    expect(mockSetItem).not.toBeCalled();
  });
});
