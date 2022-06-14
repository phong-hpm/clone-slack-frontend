import { screen } from "@testing-library/react";

// components
import ProTag from "features/ProTag";

// utils
import { customRender } from "__tests__/__setups__";

describe("Render", () => {
  test("Render ProTag", () => {
    customRender(<ProTag />);

    expect(screen.getByText("PRO")).toBeInTheDocument();
  });
});
