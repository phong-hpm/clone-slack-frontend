import { waitFor } from "@testing-library/react";
import { useEffect } from "react";
import mockIO from "socket.io-client";

// hooks
import useSocket from "hooks/useSocket";

// redux slices
import { setIsAuth, setTokens } from "store/slices/user.slice";

import { customRender, mockAxios, store } from "tests";
import { apiUrl, SocketEvent, SocketEventDefault } from "utils/constants";

// this component will help us run codes in [useSocket]
const ComponentRenderer = ({ namespace }: { namespace?: string }) => {
  const { updateNamespace } = useSocket();

  useEffect(() => {
    if (namespace) updateNamespace(namespace);
  }, [updateNamespace]);

  return <div></div>;
};

const socket = mockIO();

beforeEach(() => {
  store.dispatch(setIsAuth(true));
  store.dispatch(setTokens({ accessToken: "accessToken", refreshToken: "refreshToken" }));
  (socket.on as jest.Mock).mockClear();
});

describe("Render", () => {
  test("render without namespace", () => {
    customRender(<ComponentRenderer />);

    expect(socket.on).not.toBeCalled();
  });

  test("test ON_AUTHENTICATED handler", () => {
    (socket.on as jest.Mock).mockImplementation((eventName: string, callback: Function) => {
      if (eventName === SocketEvent.ON_AUTHENTICATED) callback({ authenticated: false });
    });

    customRender(<ComponentRenderer namespace="T-123456789" />);

    expect(socket.on).toBeCalledWith(SocketEvent.ON_AUTHENTICATED, expect.any(Function));
    expect(store.getState().user.isAuth).toBeFalsy();
  });

  test("test ON_ATOKEN_EXPIRED handler", async () => {
    mockAxios.onPost(apiUrl.auth.refreshToken).reply(({ data }) => {
      const { refreshToken } = JSON.parse(data).postData;
      return [200, { ok: refreshToken === "refreshToken", accessToken: "newAccessToken" }];
    });

    // because [useSocket] will dispatch [renewAccessToken] when token expired
    //   and [renewAccessToken] update accessToken
    // After all, socket will reconnect, so when [callback] will be fired again
    //   [useSocket] will be looped infinity
    let fired = false;
    (socket.on as jest.Mock).mockImplementation((eventName: string, callback: Function) => {
      if (eventName === SocketEvent.ON_ATOKEN_EXPIRED) {
        if (!fired) callback();
        fired = true;
      }
    });

    customRender(<ComponentRenderer namespace="/T-123456789" />);

    expect(socket.on).toBeCalledWith(SocketEvent.ON_ATOKEN_EXPIRED, expect.any(Function));
    expect(store.getState().user.isAuth).toBeFalsy();
    // wait for api [refreshToken]
    await waitFor(() => {
      expect(store.getState().user.accessToken).toEqual("newAccessToken");
    });
  });

  test("test CONNECT_ERROR handler", () => {
    (socket.on as jest.Mock).mockImplementation((eventName: string, callback: Function) => {
      if (eventName === SocketEventDefault.CONNECT_ERROR) callback({ authenticated: false });
    });

    customRender(<ComponentRenderer namespace="T-123456789" />);

    expect(socket.on).toBeCalledWith(SocketEventDefault.CONNECT_ERROR, expect.any(Function));
  });
});
