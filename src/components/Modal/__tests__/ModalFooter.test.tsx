import { screen } from "@testing-library/react";

// components
import ModalFooter from "../ModalFooter";

// utils
import { customRender } from "tests";

describe("Test render", () => {
  test("Render with children", () => {
    customRender(
      <ModalFooter>
        <div data-testid="children" />
      </ModalFooter>
    );

    expect(screen.getByTestId("children")).toBeInTheDocument();
  });

  test("coverage", () => {
    // border will generate by Box.props, so we can't expect it
    customRender(<ModalFooter isBorder />);
  });
});
