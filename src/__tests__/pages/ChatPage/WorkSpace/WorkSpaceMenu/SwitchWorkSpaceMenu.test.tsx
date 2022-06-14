import { render, screen } from "@testing-library/react";

// components
import SwitchWorkSpaceMenu from "pages/ChatPage/WorkSpace/WorkSpaceMenu/SwitchWorkSpaceMenu";

describe("Test render", () => {
  test("Render SwitchWorkSpaceMenu", () => {
    render(<SwitchWorkSpaceMenu />);

    expect(screen.getByText("Your another workspaces")).toBeInTheDocument();
  });
});
