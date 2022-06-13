import { render, waitFor, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import LinkEditModal from "../LinkEditModal";

const mockSetFocus = jest.fn();
const mockUpdateContents = jest.fn();
const quillReact = { getEditor: () => ({ updateContents: mockUpdateContents }) };
const eventDetail = {
  quillReact,
  setFocus: mockSetFocus,
  range: { index: 0, length: 0 },
  blotRange: { index: 0, length: 0 },
};

const renderComponent = () => {
  return render(
    <div data-testid="container">
      <LinkEditModal />
    </div>
  );
};

const dispatchOpenModalEvent = async (detail?: any) => {
  const event = new Event("open-link-edit-modal");
  (event as any).detail = { ...eventDetail, ...detail };
  (event as any).event = { path: [document.createElement("div")] };
  await waitFor(() => window.dispatchEvent(event));
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("Test actions", () => {
  test("When dispatch open", async () => {
    renderComponent();

    await dispatchOpenModalEvent();

    expect(screen.getByText("Add link")).toBeInTheDocument();
    expect(screen.getByTestId("container").childNodes.length).toEqual(1);

    userEvent.keyboard("{esc}");
    expect(screen.getByTestId("container").childNodes.length).toEqual(0);
    expect(mockSetFocus).toBeCalledWith(true, eventDetail.range.index);
  });

  test("When dispatch open without quillReact instance", async () => {
    renderComponent();

    await dispatchOpenModalEvent({ quillReact: null });

    expect(screen.getByTestId("container").childNodes.length).toEqual(0);
  });

  test("When dispatch open with a selected link text", async () => {
    renderComponent();

    await dispatchOpenModalEvent({ blotRange: { index: 0, length: 10 } });

    expect(screen.getByText("Edit link")).toBeInTheDocument();
  });

  test("Input Text, Link fields and click Save", async () => {
    renderComponent();

    await dispatchOpenModalEvent();

    userEvent.type(screen.getByPlaceholderText("Text"), "text");
    userEvent.type(screen.getByPlaceholderText("Link"), "link");
    userEvent.click(screen.getByText("Save"));

    expect(mockUpdateContents).toBeCalledWith({
      ops: [
        {
          insert: "text",
          attributes: { link: { href: "link", isEditable: true, text: "text" } },
        },
      ],
    });
    expect(screen.getByTestId("container").childNodes.length).toEqual(0);
  });

  test("Input Text, Link fields and click Sav when has blotRange", async () => {
    renderComponent();

    await dispatchOpenModalEvent({ blotRange: { index: 0, length: 10 } });

    userEvent.type(screen.getByPlaceholderText("Text"), "text");
    userEvent.type(screen.getByPlaceholderText("Link"), "link");
    userEvent.click(screen.getByText("Save"));

    expect(mockUpdateContents).toBeCalledWith({
      ops: [
        {
          insert: "text",
          attributes: { link: { href: "link", isEditable: true, text: "text" } },
        },
        { delete: 10 },
      ],
    });
    expect(screen.getByTestId("container").childNodes.length).toEqual(0);
  });

  test("Input Text, Link fields and click Save when missing range", async () => {
    renderComponent();

    await dispatchOpenModalEvent({ range: null });

    userEvent.type(screen.getByPlaceholderText("Text"), "text");
    userEvent.type(screen.getByPlaceholderText("Link"), "link");
    userEvent.click(screen.getByText("Save"));

    expect(mockUpdateContents).not.toBeCalled();
    expect(screen.getByTestId("container").childNodes.length).toEqual(1);
  });
});
