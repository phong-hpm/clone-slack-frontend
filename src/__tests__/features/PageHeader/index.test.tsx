import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useNavigate } from "react-router-dom";

// components
import PageHeader from "features/PageHeader";
import featuresConstants from "features/_features.constants";

// utils
import { customRender } from "__tests__/__setups__";
import { routePaths } from "utils/constants";
import { getPlatform } from "utils/detectplatform";

const { navbarList, navbarProductList } = featuresConstants.pageHeader;

describe("Test render", () => {
  test("Render PageHeader", () => {
    customRender(<PageHeader />);

    expect(screen.getByText(/Product/)).toBeInTheDocument();
    expect(screen.getByText("Solutions")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getByText("Resouces")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });

  test("Render PageHeader fixed position", () => {
    customRender(<PageHeader isFixed />);

    expect(screen.getByText(/Product/)).toBeInTheDocument();
    expect(screen.getByText("Solutions")).toBeInTheDocument();
    expect(screen.getByText("Enterprise")).toBeInTheDocument();
    expect(screen.getByText("Resouces")).toBeInTheDocument();
    expect(screen.getByText("Pricing")).toBeInTheDocument();
    expect(screen.getByText("Sign in")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click Slack logo", () => {
    const mockNavigate = useNavigate();

    customRender(<PageHeader />);

    userEvent.click(document.getElementsByTagName("svg")[0]);
    expect(mockNavigate).toBeCalledWith(routePaths.HOME_PAGE);
  });

  test("Click Sign in", () => {
    const mockNavigate = useNavigate();

    customRender(<PageHeader />);

    userEvent.click(screen.getByText("Sign in"));
    expect(mockNavigate).toBeCalledWith(routePaths.SIGNIN_PAGE);
  });

  test("Click TRY FOR FREE", () => {
    const mockNavigate = useNavigate();

    customRender(<PageHeader />);

    userEvent.click(screen.getByText("TRY FOR FREE"));
    expect(mockNavigate).toBeCalledWith(routePaths.SIGNUP_PAGE);
  });

  test("Click Download Slack", () => {
    const mockNavigate = useNavigate();

    customRender(<PageHeader />);

    userEvent.hover(screen.getByText(/Product/));
    userEvent.click(screen.getByText("Download Slack"));
    userEvent.unhover(screen.getByText(/Product/));
    expect(mockNavigate).toBeCalledWith(`${routePaths.DOWNLOAD_PAGE}/${getPlatform()}`);
  });

  test("Click navbar items", async () => {
    const mockNavigate = useNavigate();

    customRender(<PageHeader />);

    navbarList.forEach(({ label, to }) => {
      userEvent.click(screen.getByText(label));
      expect(mockNavigate).toBeCalledWith(to);
    });

    // hover in Product menu
    userEvent.hover(screen.getByText(/Product/));
    userEvent.hover(document.querySelector(".light .MuiList-root")!);
    navbarProductList.forEach(({ label, to }) => {
      userEvent.click(screen.getByText(label));
      expect(mockNavigate).toBeCalledWith(to);
    });

    // unhover product Menu list
    userEvent.unhover(screen.getByText(/Product/));
    userEvent.unhover(document.querySelector(".light .MuiList-root")!);
    // Mui Menu is using animation when hiding [MenuItem]
    // so [MenuItem] will be unmounted after animation time
    // we have to wait for them unmounted
    await waitFor(() => expect(screen.queryByText(navbarProductList[0].label)).toBeNull());
  });

  test("Click bar icon to show sidebar", () => {
    customRender(<PageHeader />);

    // bar button
    userEvent.click(screen.getAllByRole("button")[1]);
    expect(screen.getAllByText(/Product/)).toHaveLength(2);

    // close Sidebar button
    userEvent.click(screen.getAllByRole("button")[3]);
    expect(screen.getAllByText(/Product/)).toHaveLength(1);
  });
});
