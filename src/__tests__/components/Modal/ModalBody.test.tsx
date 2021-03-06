import { screen } from "@testing-library/react";

// components
import ModalBody from "components/Modal/ModalBody";

// utils
import { customRender } from "__tests__/__setups__";

describe("Test render", () => {
  test("Render with children", () => {
    customRender(
      <ModalBody ref={() => {}}>
        <div data-testid="children" />
      </ModalBody>
    );

    expect(screen.getByTestId("children")).toBeInTheDocument();
  });

  test("Render with children", () => {
    const mockOnCanScroll = jest.fn();
    customRender(
      <ModalBody ref={() => {}} onCanScroll={mockOnCanScroll}>
        <div data-testid="children" />
      </ModalBody>
    );

    expect(screen.getByTestId("children")).toBeInTheDocument();
    expect(mockOnCanScroll).toBeCalledWith(false);
  });
});
