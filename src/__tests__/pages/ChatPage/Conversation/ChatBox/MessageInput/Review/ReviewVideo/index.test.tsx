import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import ReviewVideo, {
  ReviewVideoProps,
} from "pages/ChatPage/Conversation/ChatBox/MessageInput/Review/ReviewVideo";

// utils
import * as videoRecorder from "utils/videoRecorder";

// types
import { MessageFileType } from "store/slices/_types";
import { SelectThumnailModalProps } from "components/MediaPlayer/SelectThumbnailModal";

jest.mock("components/SlackIcon", () => ({ icon }: { icon: string }) => (
  <div data-testid="SlackIcon">{icon}</div>
));
jest.mock(
  "@mui/material/Slider",
  () =>
    ({ onChange }: { onChange: (e: any, n: number) => void }) => {
      return (
        <div data-testid="Slider">
          <div data-testid="fire-onChange" onClick={() => onChange({}, 10)}></div>
        </div>
      );
    }
);

jest.mock(
  "components/MediaPlayer/SelectThumbnailModal",
  () => (props: SelectThumnailModalProps) =>
    (
      <div data-testid="SelectThumbnailModal">
        <div data-testid="fire-onClose" onClick={() => props?.onClose()} />
      </div>
    )
);

const videoFile: MessageFileType = {
  id: "video-id",
  type: "video",
  url: "http://example.com",
  duration: 75,
  mineType: "video/webm",
  createdTime: Date.now(),
  thumb: "http://example.com/thumb",
};

const thumbList = ["http://example.com/created_thumb_1", "http://example.com/created_thumb_2"];

beforeEach(() => {
  jest
    .spyOn(videoRecorder, "createThumbnails")
    .mockImplementation(() => Promise.resolve(thumbList));
});

const renderComponent = (props?: Partial<ReviewVideoProps>) => {
  return render(<ReviewVideo isOpen file={videoFile} onClose={() => {}} {...props} />);
};

describe("Test render", () => {
  test("When thumbList is empty", async () => {
    const mockOnUpdateThumbList = jest.fn();
    renderComponent({ onUpdateThumbList: mockOnUpdateThumbList });

    await waitFor(() => expect(mockOnUpdateThumbList).toBeCalledWith(thumbList));
  });
});

describe("Test actions", () => {
  test("Click Start Over", () => {
    const mockOnStartOver = jest.fn();
    renderComponent({ onStartOver: mockOnStartOver });

    userEvent.click(screen.getByText("Start Over"));
    expect(mockOnStartOver).toBeCalledWith(expect.objectContaining({ type: "click" }));
  });

  test("When progressBar change", () => {
    const mockOnDone = jest.fn();
    renderComponent({ onDone: mockOnDone });

    const videoEl = document.getElementsByTagName("video")[0];
    userEvent.click(screen.getByTestId("fire-onChange"));
    fireEvent.timeUpdate(videoEl, { target: { currentTime: 10 } });
    expect(videoEl.currentTime).toEqual(10);
  });

  test("Click Play/Pause", () => {
    const mockPlay = jest.fn();
    const mockPause = jest.fn();

    renderComponent();
    const videoEl = document.getElementsByTagName("video")[0] as HTMLVideoElement;
    videoEl.play = mockPlay;
    videoEl.pause = mockPause;

    userEvent.click(screen.getByText("play"));
    fireEvent.playing(videoEl);
    expect(mockPlay).toBeCalledWith();

    userEvent.click(screen.getByText("pause"));
    fireEvent.pause(videoEl);
    expect(mockPause).toBeCalledWith();
  });

  test("Click download", () => {
    const mockWindowOpen = jest.fn();
    jest.spyOn(window, "open").mockImplementation(mockWindowOpen);
    renderComponent({ downloadable: true });

    userEvent.click(screen.getByText("Download"));
    expect(mockWindowOpen).toBeCalledWith(videoFile.url);
  });

  test("Click select thumbnail", () => {
    const mockOnThumbnail = jest.fn();
    renderComponent({ onThumbnail: mockOnThumbnail });

    userEvent.click(screen.getByText("Select thumbnail"));
    expect(screen.getByTestId("SelectThumbnailModal")).toBeInTheDocument();

    userEvent.click(screen.getByTestId("fire-onClose"));
    expect(screen.queryByTestId("SelectThumbnailModal")).toBeNull();
  });

  test("Click play", () => {
    const mockOnDone = jest.fn();
    renderComponent({ onDone: mockOnDone });

    userEvent.click(screen.getByTestId("fire-onChange"));
    const videoEl = document.getElementsByTagName("video")[0];
    expect(videoEl.currentTime).toEqual(10);
  });

  test("Click Done", () => {
    const mockOnDone = jest.fn();
    renderComponent({ onDone: mockOnDone });

    userEvent.click(screen.getByText("Done"));
    expect(mockOnDone).toBeCalledWith(expect.objectContaining({ type: "click" }));
  });
});
