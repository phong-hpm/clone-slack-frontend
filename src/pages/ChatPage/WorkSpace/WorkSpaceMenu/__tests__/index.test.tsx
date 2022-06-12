import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { setUser } from "store/slices/user.slice";

// components
import { customRender, store } from "tests";

// components
import WorkSpaceMenu from "..";

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
  workspaceUrl: "phonghoworkspace.slack.com",
};

const anchorEl = document.createElement("div");

beforeEach(() => {
  store.dispatch(setUser(userData));
});

describe("Test render", () => {
  test("Render WorkSpaceMenu", () => {
    customRender(<WorkSpaceMenu open anchorEl={anchorEl} title="title" />);

    expect(
      screen.getByText("Your workspace is currently on the free version of Slack.")
    ).toBeInTheDocument();
    expect(screen.getByText("See plans")).toBeInTheDocument();
    expect(screen.getByText(userData.workspaceUrl)).toBeInTheDocument();
    expect(screen.getByText(`Invite people to ${userData.name}`)).toBeInTheDocument();
    expect(screen.getByText("Create a channel")).toBeInTheDocument();
    expect(screen.getByText("Preferences")).toBeInTheDocument();
    expect(screen.getByText("Administration")).toBeInTheDocument();
    expect(screen.getByText("Tools")).toBeInTheDocument();
    expect(screen.getByText("Add workspaces")).toBeInTheDocument();
    expect(screen.getByText("Switch workspaces")).toBeInTheDocument();
    expect(screen.getByText("Open the desktop app")).toBeInTheDocument();
    expect(screen.getByText("Sign in on mobile")).toBeInTheDocument();
    expect(screen.getByText(`Sign out of ${userData.name}`)).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click see plans", () => {
    const mockWindowOpen = jest.fn();
    jest.spyOn(window, "open").mockImplementation(mockWindowOpen);

    customRender(<WorkSpaceMenu open anchorEl={anchorEl} title="title" />);

    userEvent.click(screen.getByText("See plans"));
    expect(mockWindowOpen).toBeCalledWith(
      "https://app.slack.com/plans/T03C86ABPDX?entry_point=team_menu_plan_info"
    );
  });

  test("Click Create a channel", () => {
    const mockOnClose = jest.fn();
    customRender(<WorkSpaceMenu open anchorEl={anchorEl} title="title" onClose={mockOnClose} />);

    // click backdrop to hide menu
    userEvent.click(screen.getByText("Create a channel"));
    expect(store.getState().globalModal.isOpenCreateChannel).toBeTruthy();
    expect(mockOnClose).toBeCalledWith({}, "backdropClick");
  });

  test("Click Sign out", () => {
    const mockOnClose = jest.fn();
    customRender(<WorkSpaceMenu open anchorEl={anchorEl} title="title" onClose={mockOnClose} />);

    // click backdrop to hide menu
    userEvent.click(screen.getByText(`Sign out of ${userData.name}`));
    expect(store.getState().user.accessToken).toEqual("");
    expect(store.getState().user.refreshToken).toEqual("");
    expect(store.getState().user.isAuth).toBeFalsy();
    expect(mockOnClose).toBeCalledWith({}, "backdropClick");
  });
});
