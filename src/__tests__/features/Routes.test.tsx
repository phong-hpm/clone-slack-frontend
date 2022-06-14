import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";

// components
import Routes from "features/Routes";

// store
import { setupStore } from "store";
import { setIsAuth } from "store/slices/user.slice";

// utils
import { routePaths } from "utils/constants";

jest.mock("pages/NotFoundPage", () => () => <div>NotFoundPage</div>);
jest.mock("pages/HomePage", () => () => <div>HomePage</div>);
jest.mock("pages/ChatPage", () => () => <div>ChatPage</div>);
jest.mock("pages/AccountPage/Signup", () => () => <div>Signup</div>);
jest.mock("pages/AccountPage/Signin", () => () => <div>Signin</div>);
jest.mock("pages/AccountPage/ConfirmCode", () => () => <div>ConfirmCode</div>);
jest.mock("pages/AccountPage/TeamList", () => () => <div>TeamList</div>);
jest.mock("pages/AccountPage/AccountWrapper", () => ({ children }: { children: JSX.Element }) => (
  <>
    <div>AccountWrapper</div>
    <div>{children}</div>
  </>
));
jest.mock("features/RouteAuth", () => ({ children }: { children: JSX.Element }) => (
  <>
    <div>RouteAuth</div>
    <div>{children}</div>
  </>
));

const store = setupStore();

beforeAll(() => {
  store.dispatch(setIsAuth(true));
});

const renderComponent = () => {
  render(
    <Provider store={store}>
      <Routes />
    </Provider>
  );
};

describe("Render", () => {
  test("Test path not match", () => {
    window.history.pushState({}, "", `wrong-path`);
    renderComponent();

    expect(screen.getByText("NotFoundPage")).toBeInTheDocument();
  });

  test("Test path HOME_PAGE", () => {
    window.history.pushState({}, "", routePaths.HOME_PAGE);
    renderComponent();

    expect(screen.getByText("HomePage")).toBeInTheDocument();
  });

  test("Test path SIGNIN_PAGE", () => {
    window.history.pushState({}, "", routePaths.SIGNIN_PAGE);
    renderComponent();

    expect(screen.getByText("AccountWrapper")).toBeInTheDocument();
    expect(screen.getByText("Signin")).toBeInTheDocument();
  });

  test("Test path SIGNUP_PAGE", () => {
    window.history.pushState({}, "", routePaths.SIGNUP_PAGE);
    renderComponent();

    expect(screen.getByText("AccountWrapper")).toBeInTheDocument();
    expect(screen.getByText("Signup")).toBeInTheDocument();
  });

  test("Test path CONFIRM_CODE_PAGE", () => {
    window.history.pushState({}, "", routePaths.CONFIRM_CODE_PAGE);
    renderComponent();

    expect(screen.getByText("AccountWrapper")).toBeInTheDocument();
    expect(screen.getByText("ConfirmCode")).toBeInTheDocument();
  });

  test("Test path TEAM_PAGE", () => {
    window.history.pushState({}, "", routePaths.TEAM_PAGE);
    renderComponent();

    expect(screen.getByText("RouteAuth")).toBeInTheDocument();
    expect(screen.getByText("AccountWrapper")).toBeInTheDocument();
    expect(screen.getByText("TeamList")).toBeInTheDocument();
  });

  test("Test path CHATBOX_PAGE", () => {
    window.history.pushState({}, "", `${routePaths.CHATBOX_PAGE}/T-123456`);
    renderComponent();

    expect(screen.getByText("RouteAuth")).toBeInTheDocument();
    expect(screen.getByText("ChatPage")).toBeInTheDocument();
  });
});
