import { useContext, useEffect } from "react";
import { screen, render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import PlayerBase from "components/MediaPlayer/VideoPlayer/PlayerBase";

// context
import {
  VideoPlayerContext,
  VideoPlayerContextProvider,
} from "components/MediaPlayer/VideoPlayer/VideoPlayerContext";

jest.mock(
  "@mui/material/Slider",
  () =>
    ({ onChange }: { onChange: (e: any, n: number) => void }) => {
      return (
        <div data-testid="Slider">
          <div data-testid="trigger-onChangeProgress" onClick={() => onChange({}, 10)}></div>
        </div>
      );
    }
);

jest.mock("@mui/material/Select", () => ({ onChange }: { onChange: (e: any) => void }) => {
  return (
    <div data-testid="Select">
      <div
        data-testid="trigger-onChangeSpeed"
        onClick={() => onChange({ target: { value: "1.5" } })}
      ></div>
    </div>
  );
});

const ComponentSupport = ({ initState, children }: any) => {
  const { state, updateState } = useContext(VideoPlayerContext);

  useEffect(() => {
    updateState({
      src: "http://example.com",
      channelName: "channel name",
      isFullScreen: false,
      isShowThreadScriptBar: true,
      scripts: [{ label: "Start video", currentTime: 10 }],
      userOwner: {},
      createdTime: Date.now(),
      ...initState,
    });
  }, [initState]);

  return (
    <div>
      {children}
      <div data-testid="currentTime" children={String(state.currentTime)} />
      <div data-testid="volume" children={String(state.volume)} />
      <div data-testid="isPlaying" children={String(state.isPlaying)} />
      <div
        data-testid="toggle-isFullScreen"
        onClick={() => updateState({ isFullScreen: !state.isFullScreen })}
      />
      <div data-testid="remove-src" onClick={() => updateState({ src: "" })} />
    </div>
  );
};

const renderComponent = ({ initState }: any = {}) => {
  return render(
    <VideoPlayerContextProvider dataProps={{} as any}>
      <ComponentSupport initState={initState} children={<PlayerBase ref={() => {}} />} />
    </VideoPlayerContextProvider>
  );
};

describe("Test render", () => {
  test("Render video has empty src", () => {
    renderComponent();

    userEvent.click(screen.getByTestId("remove-src"));
    const videoEl = document.getElementsByTagName("video")[0];
    expect(videoEl).toBeInTheDocument();
  });

  test("Render video has src", () => {
    renderComponent();

    const videoEl = document.getElementsByTagName("video")[0];
    expect(videoEl).toBeInTheDocument();
  });
});

describe("Test actions", () => {
  test("Hover control", () => {
    renderComponent();

    // hover video controls to show control buttons
    const videoEl = document.getElementsByTagName("video")[0];
    userEvent.hover(videoEl.parentElement?.nextSibling as HTMLDivElement);
    expect(screen.getByText("0:00")).toBeInTheDocument();
    expect(screen.getByLabelText("Expand")).toBeInTheDocument();
    expect(screen.getByLabelText("More actions")).toBeInTheDocument();
    expect(screen.getByLabelText("Mute")).toBeInTheDocument();
    expect(screen.getByLabelText("Speed")).toBeInTheDocument();
    expect(screen.getByLabelText("Turn on captions")).toBeInTheDocument();
    expect(screen.getByLabelText("View transcript")).toBeInTheDocument();

    userEvent.unhover(videoEl.parentElement?.nextSibling as HTMLDivElement);
    expect(screen.getByText("0:00")).toBeInTheDocument();
    expect(screen.queryByLabelText("Expand")).toBeNull();
    expect(screen.queryByLabelText("More actions")).toBeNull();
    expect(screen.queryByLabelText("Mute")).toBeNull();
    expect(screen.queryByLabelText("Speed")).toBeNull();
    expect(screen.queryByLabelText("Turn on captions")).toBeNull();
    expect(screen.queryByLabelText("View transcript")).toBeNull();
  });

  test("Click expand", () => {
    renderComponent();

    // hover video controls to show control buttons
    const videoEl = document.getElementsByTagName("video")[0];
    userEvent.hover(videoEl.parentElement?.nextSibling as HTMLDivElement);

    // click expand
    userEvent.click(screen.getByLabelText("Expand"));
    expect(screen.getByLabelText("Play")).toBeInTheDocument();
    expect(screen.getByText("0:00 / 0:00")).toBeInTheDocument();
    expect(screen.getByLabelText("Mute")).toBeInTheDocument();
    expect(screen.getByLabelText("Speed")).toBeInTheDocument();
    expect(screen.getByLabelText("Turn on captions")).toBeInTheDocument();
    expect(screen.getByLabelText("Show thread & transcript")).toBeInTheDocument();
    expect(screen.getByLabelText("Open in...")).toBeInTheDocument();
    expect(screen.getByLabelText("More actions")).toBeInTheDocument();
  });

  test("Click play/pause", () => {
    // Because we don't have a playable src for video
    // so we have to mock play/pause actions of video
    const mockPause = jest.fn();
    const mockPlay = jest.fn();
    jest.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(mockPause);
    jest.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(mockPlay);

    renderComponent();

    // click to play
    userEvent.click(screen.getByText("0:00"));
    expect(mockPlay).toBeCalledWith();

    // play/pause actions of video was mocked
    // we have to fire time manually
    const videoEl = document.getElementsByTagName("video")[0];
    fireEvent.playing(videoEl);

    // click to pause
    userEvent.click(screen.getByText("0:00"));
    expect(mockPause).toBeCalledWith();
  });

  test("Click volumn", () => {
    renderComponent();

    // hover video controls to show control buttons
    const videoEl = document.getElementsByTagName("video")[0];
    userEvent.hover(videoEl.parentElement?.nextSibling as HTMLDivElement);

    // click to mute
    expect(videoEl.volume).toEqual(1);
    userEvent.click(screen.getByLabelText("Mute"));
    expect(videoEl.volume).toEqual(0);

    // click to max movume
    userEvent.click(screen.getByLabelText("Mute"));
    expect(videoEl.volume).toEqual(1);
  });

  test("Change playbackRate", () => {
    renderComponent();

    // hover video controls to show control buttons
    const videoEl = document.getElementsByTagName("video")[0];
    userEvent.hover(videoEl.parentElement?.nextSibling as HTMLDivElement);

    // click to mute
    expect(videoEl.playbackRate).toEqual(1);
    userEvent.click(screen.getByTestId("trigger-onChangeSpeed"));
    expect(videoEl.playbackRate).toEqual(1.5);
  });

  test("Change currentTime", () => {
    renderComponent();

    // hover video controls to show control buttons
    const videoEl = document.getElementsByTagName("video")[0];
    userEvent.hover(videoEl.parentElement?.nextSibling as HTMLDivElement);

    // click to mute
    expect(videoEl.currentTime).toEqual(0);
    userEvent.click(screen.getByTestId("trigger-onChangeProgress"));
    expect(videoEl.currentTime).toEqual(10);
  });

  test("When playing", () => {
    renderComponent();

    const videoEl = document.getElementsByTagName("video")[0];
    expect(screen.getByTestId("isPlaying")).toHaveTextContent("false");
    fireEvent.playing(videoEl);
    expect(screen.getByTestId("isPlaying")).toHaveTextContent("true");
  });

  test("When volumn change", () => {
    renderComponent();

    const videoEl = document.getElementsByTagName("video")[0];
    expect(screen.getByTestId("volume")).toHaveTextContent("1");
    fireEvent.volumeChange(videoEl, { target: { volume: 0.5 } });
    expect(screen.getByTestId("volume")).toHaveTextContent("5");
  });

  test("When currentTime change", () => {
    renderComponent();

    const videoEl = document.getElementsByTagName("video")[0];
    expect(screen.getByTestId("currentTime")).toHaveTextContent("0");
    fireEvent.timeUpdate(videoEl, { target: { currentTime: 30 } });
    expect(screen.getByTestId("currentTime")).toHaveTextContent("30");
  });
});
