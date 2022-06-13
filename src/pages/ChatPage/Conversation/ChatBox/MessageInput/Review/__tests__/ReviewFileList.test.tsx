import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { FC, useContext, useEffect } from "react";
import { MessageFileType } from "store/slices/_types";
import InputContext, { MessageInputProvider } from "../../InputContext";
import { ReviewAudioCardProps } from "../ReviewAudioCard";

// components
import ReviewFileList from "../ReviewFileList";

// types
import { ReviewVideoProps } from "../ReviewVideo";
import { ReviewVideoCardProps } from "../ReviewVideoCard";

jest.mock("components/MediaPlayer/AudioPlayer", () => () => <div data-testid="AudioPlayer" />);
jest.mock("../ReviewAudioCard.tsx", () => (props: ReviewAudioCardProps) => (
  <div data-testid="ReviewAudioCard">
    <div data-testid="fire-onRemove" onClick={() => props.onRemove?.()} />
  </div>
));
jest.mock("../ReviewVideoCard.tsx", () => (props: ReviewVideoCardProps) => (
  <div data-testid="ReviewVideoCard">
    <div data-testid="fire-onRemove" onClick={() => props.onRemove?.()} />
  </div>
));

const audioFile: MessageFileType = {
  id: "audio-id",
  type: "audio",
  url: "http://example.com",
  duration: 75,
  mineType: "audio/webm",
  createdTime: Date.now(),
};

const videoFile: MessageFileType = {
  id: "video-id",
  type: "video",
  url: "http://example.com",
  duration: 75,
  mineType: "video/webm",
  createdTime: Date.now(),
  thumb: "http://example.com/thumb",
};

const ComponentSupport: FC = () => {
  const { setInputFile, appState } = useContext(InputContext);

  useEffect(() => {
    setInputFile(videoFile);
    setInputFile(audioFile);
  }, []);

  return (
    <div>
      <div data-testid="inputFiles.length">{appState.inputFiles.length}</div>
    </div>
  );
};

const renderComponent = () => {
  return render(
    <MessageInputProvider configActions={{}}>
      <ComponentSupport />
      <ReviewFileList />
    </MessageInputProvider>
  );
};

describe("Test render", () => {
  test("Render ReviewFileList", () => {
    renderComponent();

    expect(screen.getByTestId("ReviewVideoCard")).toBeInTheDocument();
    expect(screen.getByTestId("ReviewAudioCard")).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Click remove buttons", () => {
    renderComponent();

    expect(screen.getByTestId("inputFiles.length")).toHaveTextContent("2");

    userEvent.click(within(screen.getByTestId("ReviewVideoCard")).getByTestId("fire-onRemove"));
    userEvent.click(within(screen.getByTestId("ReviewAudioCard")).getByTestId("fire-onRemove"));

    expect(screen.getByTestId("inputFiles.length")).toHaveTextContent("0");
  });
});
