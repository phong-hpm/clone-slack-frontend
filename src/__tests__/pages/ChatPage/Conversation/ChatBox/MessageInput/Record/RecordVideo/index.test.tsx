import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";

// contexts
import InputContext, {
  MessageInputProvider,
} from "pages/ChatPage/Conversation/ChatBox/MessageInput/InputContext";

// components
import RecordVideo, {
  RecordVideoProps,
} from "pages/ChatPage/Conversation/ChatBox/MessageInput/Record/RecordVideo";

// types
import { ReviewVideoProps } from "pages/ChatPage/Conversation/ChatBox/MessageInput/Review/ReviewVideo";
import { RecordVideoModalProps } from "pages/ChatPage/Conversation/ChatBox/MessageInput/Record/RecordVideo/RecordVideoModal";

jest.mock(
  "pages/ChatPage/Conversation/ChatBox/MessageInput/Record/RecordVideo/RecordVideoModal",
  () => (props: RecordVideoModalProps) =>
    props.isOpen ? (
      <div data-testid="RecordVideoModal">
        <div data-testid="fire-onNext" onClick={() => props.onNext?.("http://example.com", 65)} />
        <div data-testid="fire-onClose" onClick={() => props.onClose?.()} />
      </div>
    ) : (
      <></>
    )
);
jest.mock(
  "pages/ChatPage/Conversation/ChatBox/MessageInput/Review/ReviewVideo",
  () => (props: ReviewVideoProps) =>
    props.isOpen ? (
      <div data-testid="ReviewVideo">
        <div data-testid="fire-onStartOver" onClick={() => props.onStartOver?.()} />
        <div
          data-testid="fire-onSelectThumbnail"
          onClick={() => props.onSelectThumbnail?.("http://example.com")}
        />
        <div
          data-testid="fire-onUpdateThumbList"
          onClick={() => props.onUpdateThumbList?.(["http://example.com"])}
        />
        <div data-testid="fire-onDone" onClick={() => props.onDone?.()} />
        <div data-testid="fire-onClose" onClick={() => props.onClose?.()} />
      </div>
    ) : (
      <></>
    )
);

const ComponentSupport = (props?: { getInputFiles?: Function }) => {
  const { appState } = useContext(InputContext);

  return (
    <div>
      <div
        // when fire this Click, testcase can know what values [inputFiles] has
        data-testid="fire-getInputFiles"
        onClick={() => props?.getInputFiles?.(appState.inputFiles)}
      />
    </div>
  );
};

const renderComponent = (props?: Partial<RecordVideoProps>, getInputFiles?: Function) => {
  return render(
    <MessageInputProvider configActions={{}}>
      <ComponentSupport getInputFiles={getInputFiles} />
      <RecordVideo isOpen onClose={() => {}} {...props} />
    </MessageInputProvider>
  );
};

describe("Test render", () => {
  test("When closed", () => {
    renderComponent({ isOpen: false });

    expect(screen.queryByTestId("RecordVideoModal")).toBeNull();
    expect(screen.queryByTestId("ReviewVideo")).toBeNull();
  });

  test("When open", () => {
    renderComponent({ isOpen: true });

    expect(screen.getByTestId("RecordVideoModal")).toBeInTheDocument();
    expect(screen.queryByTestId("ReviewVideo")).toBeNull();
  });
});

describe("Test actions", () => {
  test("Click Review to move to next step", () => {
    const mockOnClose = jest.fn();
    const mockGetInputFiles = jest.fn();
    // "recording" stage
    renderComponent({ onClose: mockOnClose }, mockGetInputFiles);

    expect(screen.getByTestId("RecordVideoModal")).toBeInTheDocument();
    expect(screen.queryByTestId("ReviewVideo")).toBeNull();

    // "review" stage
    userEvent.click(within(screen.getByTestId("RecordVideoModal")).getByTestId("fire-onNext"));

    expect(screen.queryByTestId("RecordVideoModal")).toBeNull();
    expect(screen.getByTestId("ReviewVideo")).toBeInTheDocument();

    // select a new thumbnail
    userEvent.click(
      within(screen.getByTestId("ReviewVideo")).getByTestId("fire-onSelectThumbnail")
    );

    // update new thumbnails list
    userEvent.click(
      within(screen.getByTestId("ReviewVideo")).getByTestId("fire-onUpdateThumbList")
    );

    // Click done to finish
    userEvent.click(within(screen.getByTestId("ReviewVideo")).getByTestId("fire-onDone"));
    // Fire this one to check [inputFiles] state
    userEvent.click(screen.getByTestId("fire-getInputFiles"));

    expect(mockOnClose).toBeCalledWith();
    expect(mockGetInputFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          createdTime: expect.any(Number),
          duration: 65,
          mineType: "video/webm",
          ratio: 0.5625,
          thumb: "http://example.com",
          thumbList: ["http://example.com"],
          type: "video",
          url: "http://example.com",
        }),
      ])
    );
  });

  test("Click Start over", () => {
    // "recording" stage
    renderComponent();

    // "review" stage
    // Move to review step
    userEvent.click(within(screen.getByTestId("RecordVideoModal")).getByTestId("fire-onNext"));

    // "recording" stage
    // Start over
    userEvent.click(within(screen.getByTestId("ReviewVideo")).getByTestId("fire-onStartOver"));

    expect(screen.getByTestId("RecordVideoModal")).toBeInTheDocument();
    expect(screen.queryByTestId("ReviewVideo")).toBeNull();
  });
});
