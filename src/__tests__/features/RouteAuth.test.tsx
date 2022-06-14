import { screen } from "@testing-library/react";

// components
import RouteAuth from "features/RouteAuth";

// store
import { setIsAuth } from "store/slices/user.slice";

// utils
import { customRender, store } from "__tests__/__setups__";

describe("Render", () => {
  test("Render when didn't authenicated", () => {
    customRender(<RouteAuth>children</RouteAuth>);

    expect(screen.getByText("Authenticating . . .")).toBeInTheDocument();
    expect(screen.queryByText("children")).toBeNull();
  });

  test("Render when authenicated", () => {
    store.dispatch(setIsAuth(true));
    customRender(<RouteAuth>children</RouteAuth>);

    expect(screen.queryByText("Authenticating . . .")).toBeNull();
    expect(screen.getByText("children")).toBeInTheDocument();
  });
});
