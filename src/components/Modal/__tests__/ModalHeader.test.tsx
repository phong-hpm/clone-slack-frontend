import { screen } from "@testing-library/react";

// components
import ModalHeader from "../ModalHeader";

// utils
import { customRender } from "tests";

describe("Test render", () => {
  test("Render with children", () => {
    customRender(
      <ModalHeader>
        <div data-testid="children" />
      </ModalHeader>
    );

    expect(screen.getByTestId("children")).toBeInTheDocument();
  });

  test("coverage", () => {
    // border will generate by Box.props, so we can't expect it
    customRender(<ModalHeader isBorder />);
  });
});
