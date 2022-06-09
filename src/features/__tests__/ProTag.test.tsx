import { screen } from "@testing-library/react";

// components
import ProTag from "features/ProTag";

// utils
import { customRender } from "tests";

describe("Render", () => {
  test("Render ProTag", () => {
    customRender(<ProTag />);

    expect(screen.getByText("PRO")).toBeInTheDocument();
  });
});
