import { screen } from "@testing-library/react";
import { useNavigate } from "react-router-dom";

// components
import NotFoundPage from "..";

// utils
import { routePaths } from "utils/constants";
import { customRender, history } from "tests";

describe("Test render", () => {
  test("When url path didn't exist", () => {
    const mockNavigate = useNavigate();

    history.push("/wrong-path");
    customRender(<NotFoundPage />);

    expect(mockNavigate).toBeCalledWith(routePaths.HOME_PAGE);
  });

  test("When url path existed", () => {
    const mockNavigate = useNavigate();

    history.push(`${routePaths.CUSTOMERS_PAGE}`);
    customRender(<NotFoundPage />);

    expect(mockNavigate).not.toBeCalled();
    expect(screen.getByText(/This page is under/)).toBeInTheDocument();
    expect(screen.getByText(/DEVELOPMENT/)).toBeInTheDocument();
  });
});
