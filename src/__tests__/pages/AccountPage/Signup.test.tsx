import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";

// redux actions
import * as checkEmailAcion from "store/actions/user/checkEmail";

// components
import Signup from "pages/AccountPage/Signup";

// utils
import { apiUrl, routePaths } from "utils/constants";
import { customRender, store, mockAxios } from "__tests__/__setups__";

afterEach(() => {
  mockAxios.reset();
});

const fillEmailAndClick = async (email: string) => {
  if (email) {
    // fill email to input
    const input = screen.getByRole("textbox");
    userEvent.type(input, email);
  }

  // Click signup
  await waitFor(() => userEvent.click(screen.getByRole("button", { name: "Continue" })));
};

test("Render signup page", () => {
  customRender(<Signup />);

  expect(screen.getByRole("button", { name: "Continue" })).toBeInTheDocument();
});

test("Click signup without input value", async () => {
  const mockNavigate = useNavigate();
  const mockCheckEmail = jest.spyOn(checkEmailAcion, "checkEmail");

  customRender(<Signup />);

  // Click signup
  await fillEmailAndClick("");
  expect(mockCheckEmail).not.toBeCalled();
  expect(mockNavigate).not.toBeCalled();

  // restore to the original implementation
  mockCheckEmail.mockRestore();
});

test("Fill input email and click signup, response OK", async () => {
  const mockNavigate = useNavigate();
  mockAxios
    .onPost(apiUrl.auth.checkEmail)
    .reply(({ data }) => [200, { ok: true, email: JSON.parse(data).postData.email }]);

  customRender(<Signup />);

  const email = "phonghophamminh@gmail.com";
  await fillEmailAndClick(email);

  expect(store.getState().user.emailVerifying).toEqual(email);
  expect(mockNavigate).toBeCalledWith(routePaths.CONFIRM_CODE_PAGE);
});

test("Fill input email and click signup, response CANCEL", async () => {
  const mockNavigate = useNavigate();
  mockAxios
    .onPost(apiUrl.auth.checkEmail)
    .reply(({ data }) => [200, { ok: false, email: JSON.parse(data).postData.email }]);

  customRender(<Signup />);

  const email = "phonghophamminh@gmail.com";
  await fillEmailAndClick(email);

  expect(store.getState().user.emailVerifying).toEqual("");
  expect(mockNavigate).not.toBeCalled();
});

test("Fill input email and click signup, response rejected", async () => {
  const mockNavigate = useNavigate();
  mockAxios.onPost(apiUrl.auth.checkEmail).reply(400);

  customRender(<Signup />);

  const email = "phonghophamminh@gmail.com";
  await fillEmailAndClick(email);

  expect(store.getState().user.emailVerifying).toEqual("");
  expect(mockNavigate).not.toBeCalled();
});
