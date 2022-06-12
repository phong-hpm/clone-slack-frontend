import { render, screen } from "@testing-library/react";

// components
import ToolsMenu from "../ToolsMenu";

describe("Test render", () => {
  test("Render ToolsMenu", () => {
    render(<ToolsMenu />);

    expect(screen.getByText("Workflow builder")).toBeInTheDocument();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });
});
