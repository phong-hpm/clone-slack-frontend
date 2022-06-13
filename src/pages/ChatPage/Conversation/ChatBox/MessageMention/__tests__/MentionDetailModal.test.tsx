import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// redux slices
import { setTeamUserList } from "store/slices/teamUsers.slice";

// components
import MentionDetailModal from "../MentionDetailModal";

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
    customRender(<MentionDetailModal />);

    const event = new Event("mention-clicked");
    (event as any).value = {};
    (event as any).event = { path: [document.createElement("div")] };
    await waitFor(() => window.dispatchEvent(event));

    expect(screen.getByTestId("container").childNodes.length).toEqual(0);
  });

  test("When quill-mention dipatched an event but missing anchor node", async () => {
    customRender(<MentionDetailModal />);

    const event = new Event("mention-clicked");
    (event as any).value = { id: userData.id };
    (event as any).event = { path: [] };
    await waitFor(() => window.dispatchEvent(event));

    expect(screen.getByTestId("container").childNodes.length).toEqual(0);
  });

  test("When quill-mention dipatched an event", async () => {
    customRender(<MentionDetailModal />);

    const event = new Event("mention-clicked");
    (event as any).value = { id: userData.id };
    (event as any).event = { path: [document.createElement("div")] };
    await waitFor(() => window.dispatchEvent(event));
    expect(screen.getByText(userData.name)).toBeInTheDocument();

    userEvent.keyboard("{esc}");
    expect(screen.getByTestId("container").childNodes.length).toEqual(0);
  });
});
