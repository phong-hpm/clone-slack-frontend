import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import SideBar from "features/PageHeader/SideBar";
import featuresConstants from "features/_features.constants";
import { useNavigate } from "react-router-dom";

// utils
import { customRender } from "tests";
import { routePaths } from "utils/constants";

const { navbarList, navbarProductList } = featuresConstants.pageHeader;

describe("Test render", () => {
  test("Render SideBar while closed", () => {
    customRender(<SideBar open={false} onClose={() => {}} />);

    expect(screen.queryByText(/Product/)).toBeNull();
    expect(screen.queryByText("Solutions")).toBeNull();
    expect(screen.queryByText("Enterprise")).toBeNull();
    expect(screen.queryByText("Resouces")).toBeNull();
    expect(screen.queryByText("Pricing")).toBeNull();
    expect(screen.queryByText("SIGN IN")).toBeNull();
  });

  test("Render SideBar", () => {
    const mockClose = jest.fn();
    customRender(<SideBar open onClose={mockClose} />);

    expect(screen.getByText(/Product/)).toBeInTheDocument();
    expect(screen.getByText("Solutions")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getByText("Resouces")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("SIGN IN")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click Slack logo", () => {
    const mockNavigate = useNavigate();
    const mockClose = jest.fn();

    customRender(<SideBar open onClose={mockClose} />);

    userEvent.click(document.getElementsByTagName("svg")[0]);
    expect(mockNavigate).toBeCalledWith(routePaths.HOME_PAGE);
  });

  test("Click Sign in", () => {
    const mockNavigate = useNavigate();
    const mockClose = jest.fn();

    customRender(<SideBar open onClose={mockClose} />);

    userEvent.click(screen.getByText("SIGN IN"));
    expect(mockNavigate).toBeCalledWith(routePaths.SIGNIN_PAGE);
  });

  test("Click navbar items", () => {
    const mockNavigate = useNavigate();
    const mockClose = jest.fn();

    customRender(<SideBar open onClose={mockClose} />);

    navbarList.forEach(({ label, to }) => {
      userEvent.click(screen.getByText(label));
      expect(mockNavigate).toBeCalledWith(to);
    });

    // click in Product menu
    userEvent.click(screen.getByText(/Product/));
    navbarProductList.forEach(({ label, to }) => {
      userEvent.click(screen.getByText(label));
      expect(mockNavigate).toBeCalledWith(to);
    });
  });

  test("Click close button", () => {
    const mockClose = jest.fn();
    customRender(<SideBar open onClose={mockClose} />);

    // bar button
    userEvent.click(screen.getAllByRole("button")[0]);
    expect(mockClose).toBeCalledWith(expect.objectContaining({ type: "click" }));
  });
});
