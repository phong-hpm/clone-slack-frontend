import { screen } from "@testing-library/react";

// components
import ModalHeader from "components/Modal/ModalHeader";

// utils
import { customRender } from "__tests__/__setups__";

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
