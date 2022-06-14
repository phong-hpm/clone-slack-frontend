import { screen, render, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import MoreMenu, {
  MoreMenuProps,
} from "pages/ChatPage/Conversation/ChatBox/MessageActions/MoreMenu";

const anchorEl = document.createElement("div");

const renderComponent = (props?: Partial<MoreMenuProps>) => {
  return render(
    <MoreMenu
      open
      isOwner
      anchorEl={anchorEl}
      onClickEdit={() => {}}
      onClickDelete={() => {}}
      onClose={() => {}}
      {...props}
    />
  );
};

describe("Test render", () => {
  test("When user is the owner", () => {
    renderComponent();

    expect(screen.getByText("Get notified about new replies")).toBeInTheDocument();
    expect(screen.getByText("Mark unread")).toBeInTheDocument();
    expect(screen.getByText("Remind me about this")).toBeInTheDocument();
    expect(screen.getByText("Copy link")).toBeInTheDocument();
    expect(screen.getByText("Pin to channel")).toBeInTheDocument();
    expect(screen.getByText("Edit message")).toBeInTheDocument();
    expect(screen.getByText("Delete message")).toBeInTheDocument();
    expect(screen.getByText("Add a message shortcut...")).toBeInTheDocument();
  });

  test("When message is system", () => {
    renderComponent({ isSystem: true });

    expect(screen.queryByText("Get notified about new replies")).toBeNull();
    expect(screen.getByText("Mark unread")).toBeInTheDocument();
    expect(screen.queryByText("Remind me about this")).toBeNull();
    expect(screen.getByText("Copy link")).toBeInTheDocument();
    expect(screen.queryByText("Pin to channel")).toBeNull();
    expect(screen.queryByText("Edit message")).toBeNull();
    expect(screen.queryByText("Delete message")).toBeNull();
    expect(screen.getByText("Add a message shortcut...")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Hover/unhover on Remind me about this", async () => {
    renderComponent();

    userEvent.hover(screen.getByText("Remind me about this"));
    await waitFor(() => expect(screen.getByText("In 20 minutes")).toBeInTheDocument());

    userEvent.unhover(screen.getByText("Remind me about this"));
    await waitFor(() => expect(screen.queryByText("In 20 minutes")).toBeNull());
  });

  test("Click Edit message", async () => {
    const mockOnClickEdit = jest.fn();
    const mockOnClose = jest.fn();
    renderComponent({ onClickEdit: mockOnClickEdit, onClose: mockOnClose });

    userEvent.click(screen.getByText("Edit message"));
    expect(mockOnClickEdit).toBeCalledWith(expect.objectContaining({ type: "mousedown" }));
    expect(mockOnClose).toBeCalledWith();
  });

  test("Press E", async () => {
    const mockOnClickEdit = jest.fn();
    const mockOnClose = jest.fn();
    renderComponent({ onClickEdit: mockOnClickEdit, onClose: mockOnClose });

    userEvent.keyboard("E");
    expect(mockOnClickEdit).toBeCalledWith();
  });

  test("Click Delete message", async () => {
    const mockOnClickDelete = jest.fn();
    const mockOnClose = jest.fn();
    renderComponent({ onClickDelete: mockOnClickDelete, onClose: mockOnClose });

    userEvent.click(screen.getByText("Delete message"));
    expect(mockOnClickDelete).toBeCalledWith(expect.objectContaining({ type: "mousedown" }));
    expect(mockOnClose).toBeCalledWith();
  });

  test("Press Backspace", async () => {
    const mockOnClickDelete = jest.fn();
    const mockOnClose = jest.fn();
    renderComponent({ onClickDelete: mockOnClickDelete, onClose: mockOnClose });

    userEvent.keyboard("{backspace}");
    expect(mockOnClickDelete).toBeCalledWith();
  });

  test("Press Delete", async () => {
    const mockOnClickDelete = jest.fn();
    const mockOnClose = jest.fn();
    renderComponent({ onClickDelete: mockOnClickDelete, onClose: mockOnClose });

    userEvent.keyboard("{delete}");
    expect(mockOnClickDelete).toBeCalledWith();
  });
});
