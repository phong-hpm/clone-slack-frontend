import { render, screen } from "@testing-library/react";

// components
import SwitchWorkSpaceMenu from "../SwitchWorkSpaceMenu";

describe("Test render", () => {
  test("Render SwitchWorkSpaceMenu", () => {
    render(<SwitchWorkSpaceMenu />);

    expect(screen.getByText("Your another workspaces")).toBeInTheDocument();
  });
});
