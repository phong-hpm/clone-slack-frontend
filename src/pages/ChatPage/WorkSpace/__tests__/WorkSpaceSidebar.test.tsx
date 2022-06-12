import { screen, waitFor } from "@testing-library/react";

// components
import WorkSpaceSidebar from "../WorkSpaceSidebar";

// utils
import { customRender, store } from "tests";
import { setUser } from "store/slices/user.slice";
import userEvent from "@testing-library/user-event";

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

beforeEach(() => {
  store.dispatch(setUser(userData));
});

describe("Test actions", () => {
  test("Toggle show/hide menu", async () => {
    customRender(<WorkSpaceSidebar />);

    // Click to show menu
    userEvent.click(screen.getByText(userData.name));
    expect(screen.getByText(userData.workspaceUrl)).toBeInTheDocument();

    // click backdrop to hide menu
    userEvent.click(document.querySelector(".MuiBackdrop-root")!);
    await waitFor(() => expect(screen.queryByText(userData.workspaceUrl)).toBeNull());
  });

  // This action was not implemented
  test("Click add message", async () => {
    customRender(<WorkSpaceSidebar />);

    // Click add message button
    userEvent.click(screen.getByLabelText("Add new message"));
  });
});
