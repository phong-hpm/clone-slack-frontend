import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";

// redux actions
import { setEmailVerifying } from "store/slices/user.slice";

// components
import ConfirmCode from "../ConfirmCode";

// utils
import { customRender, store, mockAxios } from "tests";
import { apiUrl, routePaths } from "utils/constants";

beforeEach(() => {
  // init store
  store.dispatch(setEmailVerifying("phonghophamminh@gmail.com"));

  mockAxios.reset();
  mockAxios.onPost(apiUrl.auth.confirmEmailCode).reply(({ data }) => {
    const { verifyCode } = JSON.parse(data).postData;
    return [
      200,
      { ok: verifyCode === "111111", accessToken: "accessToken", refreshToken: "refreshToken" },
    ];
  });
});

test("Navigate to SIGNIN_PAGE when emailVerifying state is empty", async () => {
  const mockNavigate = useNavigate();

  store.dispatch(setEmailVerifying(""));
  customRender(<ConfirmCode />);
  expect(mockNavigate).toBeCalledWith(routePaths.SIGNIN_PAGE);
});

test("Focus after fill value", async () => {
  const mockNavigate = useNavigate();

  customRender(<ConfirmCode />);
  expect(mockNavigate).not.toBeCalled();

  // fill code to input
  const inputs = screen.getAllByRole("textbox");
  expect(inputs).toHaveLength(6);

  for (let i = 0; i < 5; i++) {
    userEvent.type(inputs[i], "1");
    expect(inputs[i + 1]).toHaveFocus();
  }

  userEvent.type(inputs[0], "{backspace}");
  expect(inputs[0]).toHaveFocus();
  expect(inputs[1]).not.toHaveFocus();
});

const fillVerifyCode = async (value: string) => {
  const inputs = screen.getAllByRole("textbox");
  expect(inputs).toHaveLength(6);
  for (let i = 0; i < 5; i++) userEvent.type(inputs[i], value);
  await waitFor(() => userEvent.type(inputs[5], value));
};

test("Fill correct verify code, response OK", async () => {
  const mockNavigate = useNavigate();

  customRender(<ConfirmCode />);

  // fill code to input
  await fillVerifyCode("1");

  expect(store.getState().user.accessToken).toEqual("accessToken");
  expect(store.getState().user.refreshToken).toEqual("refreshToken");
  expect(store.getState().user.isAuth).toBeTruthy();
  expect(mockNavigate).toBeCalledWith(routePaths.TEAM_PAGE);
});

test("Fill correct verify code, response CANCEL", async () => {
  const mockNavigate = useNavigate();
  mockAxios.onPost(apiUrl.auth.confirmEmailCode).reply(200, {});

  customRender(<ConfirmCode />);

  // fill code to input
  await fillVerifyCode("1");

  expect(store.getState().user.accessToken).toEqual("");
  expect(store.getState().user.refreshToken).toEqual("");
  expect(store.getState().user.isAuth).toBeFalsy();
  expect(mockNavigate).not.toBeCalled();
});

test("Fill correct verify code, response rejected", async () => {
  const mockNavigate = useNavigate();
  mockAxios.onPost(apiUrl.auth.confirmEmailCode).reply(400, {});

  customRender(<ConfirmCode />);

  // fill code to input
  await fillVerifyCode("1");

  expect(store.getState().user.accessToken).toEqual("");
  expect(store.getState().user.refreshToken).toEqual("");
  expect(store.getState().user.isAuth).toBeFalsy();
  expect(mockNavigate).not.toBeCalled();
});

test("Fill wrong verify code", async () => {
  const mockNavigate = useNavigate();

  customRender(<ConfirmCode />);

  // fill code to input
  await fillVerifyCode("0");

  expect(store.getState().user.accessToken).toEqual("");
  expect(store.getState().user.refreshToken).toEqual("");
  expect(store.getState().user.isAuth).toBeFalsy();
  expect(mockNavigate).not.toBeCalled();
});
