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

beforeEach(() => {
  mockAxios = new MockAdapter(axiosInstance, { onNoMatch: "throwException" });
  setupAxios(store);
});

afterEach(() => {
  jest.resetAllMocks();
  mockAxios.reset();
  store.dispatch(setTokens({ refreshToken: "", accessToken: "" }));
});

Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

// because we have to use [mockAxios.onAny], but mockAxios can't be reseted in test suit scope
// we have to test this case in new test suit to mock [mockAxios.onPost] reply 402
describe("interceptors response", () => {
  test("Rejected 401, refresh token fail", async () => {
    mockAxios.onPost(apiUrl.auth.refreshToken).reply(402, {});

    // handle for code: resolve(axiosInstance(originalRequest));
    mockAxios.onAny().reply(200);
    const handler = (axiosInstance.interceptors.response as any).handlers[0];
    try {
      await handler.rejected({ config: { headers: {} }, response: { status: 401 } });
    } catch {}

    expect(store.getState().user.accessToken).toEqual("");
    expect(mockSetItem).not.toBeCalled();
    expect(mockRemoveItem).toBeCalledWith("accessToken");
  });
});
