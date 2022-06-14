import { screen } from "@testing-library/react";

// components
import ModalFooter from "components/Modal/ModalFooter";

// utils
import { customRender } from "__tests__/__setups__";

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
