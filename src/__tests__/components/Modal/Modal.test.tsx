import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import Modal from "components/Modal/Modal";
import ModalBody from "components/Modal/ModalBody";
import ModalHeader from "components/Modal/ModalHeader";
import ModalFooter from "components/Modal/ModalFooter";

// utils
import { customRender } from "__tests__/__setups__";
import { color } from "utils/constants";

describe("Test render", () => {
  test("When Modal closed", () => {
    customRender(
      <Modal isOpen={false} autoWidth autoHeight onClose={() => {}}>
        <div data-testid="children" />
      </Modal>
    );

    expect(screen.queryByTestId("children")).toBeNull();
  });

  test("When Modal is opening", () => {
    customRender(
      <Modal isOpen isArrow onClose={() => {}}>
        <div data-testid="children" />
      </Modal>
    );

    expect(screen.getByTestId("children")).toBeInTheDocument();
  });

  test("When modal has close button", () => {
    customRender(
      <Modal isOpen isCloseBtn onClose={() => {}}>
        <div data-testid="children" />
      </Modal>
    );

    expect(screen.getByTestId("children").nextSibling).toBeInTheDocument();
  });

  test("When modal has close button in corner", () => {
    customRender(
      <Modal isOpen isCloseBtnCorner onClose={() => {}}>
        <div data-testid="children" />
      </Modal>
    );

    expect(screen.getByTestId("children").nextSibling).toBeInTheDocument();
  });

  test("When ModalBody is scrollable", () => {
    Object.defineProperty(HTMLElement.prototype, "scrollHeight", {
      configurable: true,
      value: 500,
    });

    customRender(
      <Modal isOpen onClose={() => {}}>
        <ModalHeader>ModalHeader</ModalHeader>
        <ModalBody>
          <div data-testid="children" />
        </ModalBody>
        <ModalFooter>ModalFooter</ModalFooter>
      </Modal>
    );

    expect(screen.getByText("ModalHeader")).toHaveStyle({
      borderBottom: `1px solid ${color.BORDER}`,
    });
    expect(screen.getByTestId("children")).toBeInTheDocument();
    expect(screen.getByText("ModalFooter")).toHaveStyle({ borderTop: `1px solid ${color.BORDER}` });
  });

  test("When has anchor element", () => {
    const mockAnchorEl = {
      getBoundingClientRect: () => ({ top: 100, left: 100, width: 20, height: 20 }),
    } as unknown as HTMLElement;

    customRender(
      <Modal data-testid="Modal" isOpen anchorEl={mockAnchorEl} onClose={() => {}}>
        <ModalHeader>ModalHeader</ModalHeader>
        <ModalBody>
          <div data-testid="children" />
        </ModalBody>
        <ModalFooter>ModalFooter</ModalFooter>
      </Modal>
    );

    expect(document.querySelector(".modal-content")).toHaveStyle({ left: "110px", top: "100px" });
    expect(screen.getByText("ModalHeader")).toHaveStyle({
      borderBottom: `1px solid ${color.BORDER}`,
    });
    expect(screen.getByTestId("children")).toBeInTheDocument();
    expect(screen.getByText("ModalFooter")).toHaveStyle({ borderTop: `1px solid ${color.BORDER}` });
  });
});

describe("Test actions", () => {
  test("Press Esc", () => {
    const mockOnClose = jest.fn();
    customRender(<Modal isOpen onClose={mockOnClose} />);

    userEvent.keyboard("{esc}");
    expect(mockOnClose).toBeCalledWith(expect.objectContaining({ type: "keydown", keyCode: 27 }));
  });
  test("Press Enter", () => {
    const mockOnEnter = jest.fn();
    customRender(<Modal isOpen onEnter={mockOnEnter} onClose={() => {}} />);

    userEvent.keyboard("{Enter}");
    expect(mockOnEnter).toBeCalledWith();
  });
});
