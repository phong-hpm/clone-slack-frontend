import { waitFor } from "@testing-library/react";
import { useNavigate } from "react-router-dom";

// hooks
import useAuthenication from "hooks/useAuthenication";

// redux slices
import { setTokens } from "store/slices/user.slice";

import { customRender, store, mockAxios } from "tests";
import { apiUrl, routePaths } from "utils/constants";

const userData = {
  id: "U-o29OsxUsn",
  name: "Phong Ho",
  realname: "Phong Ho Pham Minh",
  email: "phonghophamminh@gmail.com",
  timeZone: "",
  teams: [],
  avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
  createdTime: 1653589513216,
  updatedTime: 1653589513216,
};

const ComponentRenderer = () => {
  useAuthenication();
  return <div></div>;
};

beforeAll(() => {
  mockAxios.onPost(apiUrl.auth.refreshToken).reply(({ data }) => {
    const { refreshToken } = JSON.parse(data).postData;
    return [200, { ok: refreshToken === "refreshToken", accessToken: "newAccessToken" }];
  });

  mockAxios.onGet(apiUrl.auth.user).reply(200, { ok: true, user: userData });
});

test("when refreshToken and accessToken is empty", () => {
  const mockNavigate = useNavigate();

  store.dispatch(setTokens({ refreshToken: "", accessToken: "" }));
  customRender(<ComponentRenderer />);

  expect(mockNavigate).toBeCalledWith(routePaths.SIGNIN_PAGE);
});

test("when accessToken is empty", async () => {
  const mockNavigate = useNavigate();

  store.dispatch(setTokens({ refreshToken: "refreshToken", accessToken: "" }));
  customRender(<ComponentRenderer />);

  await waitFor(() => {
    expect(store.getState().user.isAuth).toBeTruthy();
    expect(store.getState().user.accessToken).toEqual("newAccessToken");
    expect(store.getState().user.user).toEqual(userData);
  });

  expect(mockNavigate).not.toBeCalled();
});
