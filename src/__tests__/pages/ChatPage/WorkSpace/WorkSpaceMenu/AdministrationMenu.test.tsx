import { render, screen } from "@testing-library/react";

// components
import AdministrationMenu from "pages/ChatPage/WorkSpace/WorkSpaceMenu/AdministrationMenu";

describe("Test render", () => {
  test("Render AdministrationMenu", () => {
    render(<AdministrationMenu userName="User name" />);

    expect(screen.getByText("Customize User name")).toBeInTheDocument();
    expect(screen.getByText("Manage apps")).toBeInTheDocument();
  });
});
