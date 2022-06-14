import { screen } from "@testing-library/react";
import { useNavigate } from "react-router-dom";
import userEvent from "@testing-library/user-event";

// components
import AccountWrapper from "pages/AccountPage/AccountWrapper";

// utils
import { routePaths } from "utils/constants";
import { customRender, history } from "__tests__/__setups__";

test("Render in SIGNUP_PAGE", () => {
  history.push(routePaths.SIGNUP_PAGE);
  customRender(<AccountWrapper />);

  expect(screen.getByText("First, enter your email")).toBeInTheDocument();
  expect(screen.getByText("We suggest using the")).toBeInTheDocument();
  expect(screen.getByText("email address you use at work.")).toBeInTheDocument();
  expect(screen.getByText("Privacy & Terms")).toBeInTheDocument();
  expect(screen.getByText("Contact Us")).toBeInTheDocument();
});

test("Render in SIGNIN_PAGE", () => {
  history.push(routePaths.SIGNIN_PAGE);
  customRender(<AccountWrapper />);

  expect(screen.getByText("Sign in to Slack")).toBeInTheDocument();
  expect(screen.getByText("We suggest using the")).toBeInTheDocument();
  expect(screen.getByText("email address you use at work.")).toBeInTheDocument();
  expect(screen.getByText("Privacy & Terms")).toBeInTheDocument();
  expect(screen.getByText("Contact Us")).toBeInTheDocument();
});

test("Render in CONFIRM_CODE_PAGE", () => {
  history.push(routePaths.CONFIRM_CODE_PAGE);
  customRender(<AccountWrapper />);

  expect(screen.getByText("Check your email for a code")).toBeInTheDocument();
  expect(
    screen.getByText(
      /We've sent a 6-character code to.+The code expires shortly, so please enter it soon/
    )
  ).toBeInTheDocument();
  expect(screen.getByText("Privacy & Terms")).toBeInTheDocument();
  expect(screen.getByText("Contact Us")).toBeInTheDocument();
});

test("Render in TEAM_PAGE", () => {
  history.push(routePaths.TEAM_PAGE);
  customRender(<AccountWrapper />);

  expect(screen.getByText("Welcome back! You look nice today.")).toBeInTheDocument();
  expect(
    screen.getByText("Choose a workspace below to get back to working with your team.")
  ).toBeInTheDocument();
  expect(screen.getByText("Privacy & Terms")).toBeInTheDocument();
  expect(screen.getByText("Contact Us")).toBeInTheDocument();
});

test("click Create an account", () => {
  const mockNavigate = useNavigate();

  history.push(routePaths.SIGNIN_PAGE);
  customRender(<AccountWrapper />);

  // Click Create an account
  userEvent.click(screen.getByText("Create an account"));
  expect(mockNavigate).toBeCalledWith(routePaths.SIGNUP_PAGE);
});
