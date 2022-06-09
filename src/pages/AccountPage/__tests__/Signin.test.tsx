import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";

// redux actions
import * as checkEmailAcion from "store/actions/user/checkEmail";

// components
import Signin from "../Signin";

// utils
import { apiUrl, routePaths } from "utils/constants";
import { customRender, store, mockAxios } from "tests";

afterEach(() => {
  mockAxios.reset();
});

const fillEmailAndClick = async (email: string) => {
  if (email) {
    // fill email to input
    const input = screen.getByRole("textbox");
    userEvent.type(input, email);
  }

  // Click signin
  await waitFor(() => userEvent.click(screen.getByRole("button", { name: "Sign In with Email" })));
};

test("Render signin page", () => {
  customRender(<Signin />);

  expect(screen.getByText("Sign in with Google")).toBeInTheDocument();
  expect(screen.getByText("Sign in with Apple")).toBeInTheDocument();
  expect(screen.getByText("Sign In with Email")).toBeInTheDocument();
});

test("Click signin while input is empty", async () => {
  const mockNavigate = useNavigate();
  const mockCheckEmail = jest.spyOn(checkEmailAcion, "checkEmail");

  customRender(<Signin />);

  await fillEmailAndClick("");

  expect(mockCheckEmail).not.toBeCalled();
  expect(mockNavigate).not.toBeCalled();

  // restore to the original implementation
  mockCheckEmail.mockRestore();
});

test("Fill input email and press Enter, response OK", async () => {
  const mockNavigate = useNavigate();
  mockAxios
    .onPost(apiUrl.auth.checkEmail)
    .reply(({ data }) => [200, { ok: true, email: JSON.parse(data).postData.email }]);

  customRender(<Signin />);

  const email = "phonghophamminh@gmail.com";
  await fillEmailAndClick(email);

  // Press Enter
  await waitFor(() => userEvent.keyboard("{enter}"));
  expect(store.getState().user.emailVerifying).toEqual(email);
  expect(mockNavigate).toBeCalledWith(routePaths.CONFIRM_CODE_PAGE);
});

test("Fill input email and click signin, response OK", async () => {
  const mockNavigate = useNavigate();
  mockAxios
    .onPost(apiUrl.auth.checkEmail)
    .reply(({ data }) => [200, { ok: true, email: JSON.parse(data).postData.email }]);

  customRender(<Signin />);

  const email = "phonghophamminh@gmail.com";
  await fillEmailAndClick(email);

  // Click signin
  await waitFor(() => userEvent.click(screen.getByRole("button", { name: "Sign In with Email" })));
  expect(store.getState().user.emailVerifying).toEqual(email);
  expect(mockNavigate).toBeCalledWith(routePaths.CONFIRM_CODE_PAGE);
});

test("Fill input email and click signin, response CANCEL", async () => {
  const mockNavigate = useNavigate();
  mockAxios
    .onPost(apiUrl.auth.checkEmail)
    .reply(({ data }) => [200, { ok: false, email: JSON.parse(data).postData.email }]);

  customRender(<Signin />);

  const email = "phonghophamminh@gmail.com";
  await fillEmailAndClick(email);

  expect(store.getState().user.emailVerifying).toEqual("");
  expect(mockNavigate).not.toBeCalled();
});

test("Fill input email and click signin, response rejected", async () => {
  const mockNavigate = useNavigate();
  mockAxios.onPost(apiUrl.auth.checkEmail).reply(400);

  customRender(<Signin />);

  const email = "phonghophamminh@gmail.com";
  await fillEmailAndClick(email);

  expect(store.getState().user.emailVerifying).toEqual("");
  expect(mockNavigate).not.toBeCalled();
});
