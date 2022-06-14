import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import LinkDetailModal from "pages/ChatPage/Conversation/ChatBox/MessageLink/LinkDetailModal";

const mockSetFocus = jest.fn();
const mockBlur = jest.fn();
const mockFormatText = jest.fn();
const quillReact = { getEditor: () => ({ blur: mockBlur, formatText: mockFormatText }) };
const eventDetail = {
  quillReact,
  setFocus: mockSetFocus,
  range: { index: 0, length: 0 },
  blotRange: { index: 0, length: 10 },
  anchorEl: document.createElement("div"),
  linkValue: { href: "example.com", text: "Example" },
};

const dispatchOpenModalEvent = async (detail?: any) => {
  const event = new Event("open-link-detail-modal");
  (event as any).detail = { ...eventDetail, ...detail };
  (event as any).event = { path: [document.createElement("div")] };
  await waitFor(() => window.dispatchEvent(event));
};

beforeEach(() => {
  jest.resetAllMocks();
});

describe("Test render", () => {
  test("When dispatch open", async () => {
    render(<LinkDetailModal />);

    await dispatchOpenModalEvent();

    expect(screen.getByText("Example")).toBeInTheDocument();
    expect(screen.getByText("example.com")).toBeInTheDocument();
    expect(mockBlur).toBeCalledWith();
  });

  test("When dispatch open without quillReact instance", async () => {
    render(<div data-testid="container" children={<LinkDetailModal />} />);

    await dispatchOpenModalEvent({ quillReact: null });

    expect(screen.getByTestId("container").childNodes.length).toEqual(0);
  });
});

describe("Test acitions", () => {
  test("Click Edit", async () => {
    const mockOpenLinkEditModalListenter = jest.fn();
    window.addEventListener("open-link-edit-modal", mockOpenLinkEditModalListenter);
    render(<LinkDetailModal />);

    await dispatchOpenModalEvent();

    // Click edit
    userEvent.click(screen.getByText("Edit"));

    expect(mockOpenLinkEditModalListenter).toBeCalledWith(
      expect.objectContaining({ isTrusted: false, detail: eventDetail })
    );
    expect(screen.queryByText("Edit")).toBeNull();
  });

  test("Click Remove", async () => {
    render(<LinkDetailModal />);

    await dispatchOpenModalEvent();

    // Click edit
    userEvent.click(screen.getByText("Remove"));

    expect(mockFormatText).toBeCalledWith(eventDetail.blotRange, "link", false, "user");
    expect(screen.queryByText("Remove")).toBeNull();
  });

  test("Click Remove without blotRange", async () => {
    render(<LinkDetailModal />);

    await dispatchOpenModalEvent({ blotRange: null });

    // Click edit
    userEvent.click(screen.getByText("Remove"));

    expect(mockFormatText).not.toBeCalled();
    expect(screen.getByText("Remove")).toBeInTheDocument();
  });
});
