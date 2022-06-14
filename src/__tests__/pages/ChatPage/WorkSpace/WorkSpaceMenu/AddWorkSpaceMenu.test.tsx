import { render, screen } from "@testing-library/react";

// components
import AddWorkSpaceMenu from "pages/ChatPage/WorkSpace/WorkSpaceMenu/AddWorkSpaceMenu";

describe("Test render", () => {
  test("Render AddWorkSpaceMenu", () => {
    render(<AddWorkSpaceMenu />);

    expect(screen.getByText("Signin to another workspace")).toBeInTheDocument();
    expect(screen.getByText("Create new a workspace")).toBeInTheDocument();
    expect(screen.getByText("Find workspaces")).toBeInTheDocument();
  });
});
