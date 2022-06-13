import { screen, waitFor } from "@testing-library/react";

// redux slices
import { setTeamUserList } from "store/slices/teamUsers.slice";

// components
import MentionDetailPopover from "../MentionDetailPopover";

// utils
import { customRender, store } from "tests";

// types
import { UserType } from "store/slices/_types";

const userData: UserType = {
  id: "U-o29OsxUsn",
  name: "Phong Ho",
  realname: "Phong Ho Pham Minh",
  email: "phonghophamminh@gmail.com",
  timeZone: "",
  avatar: "http://localhost:8000/files/avatar/U-o29OsxUsn.jpeg",
};

beforeEach(() => {
  store.dispatch(setTeamUserList([userData]));
});

describe("Test render", () => {
  test("When quill-mention dipatched an event but missing value", async () => {
    customRender(<MentionDetailPopover />);

    const event = new Event("mention-hovered");
    (event as any).value = {};
    (event as any).event = { path: [document.createElement("div")] };
    await waitFor(() => window.dispatchEvent(event));

    expect(screen.getByTestId("container").childNodes.length).toEqual(0);
  });

  test("When quill-mention dipatched an event but missing anchor node", async () => {
    customRender(<MentionDetailPopover />);

    const event = new Event("mention-hovered");
    (event as any).value = { id: userData.id };
    (event as any).event = { path: [] };
    await waitFor(() => window.dispatchEvent(event));

    expect(screen.getByTestId("container").childNodes.length).toEqual(0);
  });

  test("When quill-mention dipatched an event", async () => {
    customRender(<MentionDetailPopover />);

    const hoverEvent = new Event("mention-hovered");
    (hoverEvent as any).value = { id: userData.id };
    (hoverEvent as any).event = { path: [document.createElement("div")] };
    await waitFor(() => window.dispatchEvent(hoverEvent));
    expect(screen.getByText(userData.name)).toBeInTheDocument();

    // Popover will be closed when user click on mention tag
    const clickEvent = new Event("mention-clicked");
    await waitFor(() => window.dispatchEvent(clickEvent));
    expect(screen.getByTestId("container").childNodes.length).toEqual(0);
  });
});
