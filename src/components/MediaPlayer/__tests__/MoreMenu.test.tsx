import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import MoreMenu from "../MoreMenu";

const mockAnchorEl = document.createElement("div");

const mockOnClose = jest.fn();

beforeEach(() => {
  jest.clearAllMocks();
});

const renderComponent = (props?: any) => {
  const { type = "video", url = "http://example.com" } = props || {};
  return render(
    <MoreMenu open url={url} type={type as any} anchorEl={mockAnchorEl} onClose={mockOnClose} />
  );
};

describe("Test render", () => {
  test("When type is video", () => {
    render(<MoreMenu open type="video" anchorEl={mockAnchorEl} />);

    expect(screen.getByText("Open in thread")).toBeInTheDocument();
    expect(screen.getByText("Open in new window")).toBeInTheDocument();
    expect(screen.getByText("View details")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.getByText("Share clip...")).toBeInTheDocument();
    expect(screen.getByText("Copy link to video clip")).toBeInTheDocument();
    expect(screen.getByText("Add to saved items")).toBeInTheDocument();
    expect(screen.getByText("Edit thumbnail...")).toBeInTheDocument();
    expect(screen.getByText("Delete clip")).toBeInTheDocument();
  });

  test("When type is audio", () => {
    render(<MoreMenu open type="audio" anchorEl={mockAnchorEl} />);

    expect(screen.getByText("Open in new window")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
    expect(screen.getByText("Share clip...")).toBeInTheDocument();
    expect(screen.getByText("Copy link to audio clip")).toBeInTheDocument();
    expect(screen.getByText("View details")).toBeInTheDocument();
    expect(screen.getByText("Add to saved items")).toBeInTheDocument();
    expect(screen.getByText("Delete clip")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click Open in new window", () => {
    const mockWindowOpen = jest.fn();
    jest.spyOn(window, "open").mockImplementation(mockWindowOpen);

    renderComponent();

    // click Open in new window
    userEvent.click(screen.getByText("Open in new window"));
    expect(mockWindowOpen).toBeCalledWith("http://example.com/download/");
    expect(mockOnClose).toBeCalledWith({}, "backdropClick");
  });

  test("Click Open in new window when url is empty", () => {
    const mockWindowOpen = jest.fn();
    jest.spyOn(window, "open").mockImplementation(mockWindowOpen);

    renderComponent({ url: "" });

    // click Open in new window
    userEvent.click(screen.getByText("Open in new window"));
    expect(mockWindowOpen).toBeCalledWith("");
    expect(mockOnClose).toBeCalledWith({}, "backdropClick");
  });

  test("Click copy link", () => {
    const mockWriteText = jest.fn();
    Object.assign(navigator, { clipboard: { writeText: mockWriteText } });

    renderComponent();

    // click Open in new window
    userEvent.click(screen.getByText("Copy link to video clip"));
    expect(mockWriteText).toBeCalledWith("http://example.com");
    expect(mockOnClose).toBeCalledWith({}, "backdropClick");
  });

  // to download, we have to create a anchor element
  // but we can't mock [document.createElement]
  //  or react can't render
  test("Click download", () => {
    renderComponent();

    // click Open in new window
    userEvent.click(screen.getByText("Download"));
    expect(mockOnClose).toBeCalledWith({}, "backdropClick");
  });

  test("Click download when url is empty", () => {
    renderComponent({ url: "" });

    // click Open in new window
    userEvent.click(screen.getByText("Download"));
    expect(mockOnClose).toBeCalledWith({}, "backdropClick");
  });
});
