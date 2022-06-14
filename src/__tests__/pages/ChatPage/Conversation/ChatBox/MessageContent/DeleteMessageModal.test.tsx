import userEvent from "@testing-library/user-event";
import { screen } from "@testing-library/react";

// components
import DeleteMessageModal from "pages/ChatPage/Conversation/ChatBox/MessageContent/DeleteMessageModal";

// utils
import { customRender } from "__tests__/__setups__";

// types
import { Delta } from "quill";

const messageData = {
  id: "message_1",
  type: "message",
  delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
  user: "U-o29OsxUsn",
  team: "T-Z4ijiEVH4",
  reactions: {},
  files: [],
  createdTime: 1651942800008,
  updatedTime: 1651942800008,
};

describe("", () => {
  test("", () => {
    customRender(<DeleteMessageModal isOpen message={messageData} onClose={() => {}} />);
  });
});

describe("Test actions", () => {
  test("Press esc to close modal", () => {
    const mockOnClose = jest.fn();
    customRender(<DeleteMessageModal isOpen message={messageData} onClose={mockOnClose} />);

    userEvent.keyboard("{esc}");
    expect(mockOnClose).toBeCalledWith(expect.objectContaining({ type: "keydown" }));
  });

  test("Submit delete message", () => {
    const mockOnClose = jest.fn();
    const mockOnSubmit = jest.fn();
    customRender(
      <DeleteMessageModal
        isOpen
        message={messageData}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    userEvent.click(screen.getByText("Delete"));
    expect(mockOnSubmit).toBeCalledWith();
    expect(mockOnClose).toBeCalledWith();
  });
});
