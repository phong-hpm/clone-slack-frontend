import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import AudioPlayer from "..";

const mockWaveSurfer = {
  load: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  setPlaybackRate: jest.fn(),
};
jest.mock("components/AudioWaveSurfer", () => {
  const AudioWaveSurfer = (props: any) => {
    jest.requireActual("react").useEffect(() => {
      props.onCreated?.({ id: "wavesurfer.js", ...mockWaveSurfer });
    }, []);

    return (
      <div data-testid="AudioWaveSurfer">
        <div data-testid="trigger-onLoading" onClick={() => props.onLoading(100)} />
        <div data-testid="trigger-onFinish" onClick={() => props.onFinish(100)} />
      </div>
    );
  };

  return {
    __esModule: true,
    default: AudioWaveSurfer,
  };
});

jest.mock("components/SlackIcon", () => ({ icon }: { icon: string }) => (
  <div data-testid="SlackIcon">{icon}</div>
));

describe("Test render", () => {
  test("Render AudioPlayer", () => {
    const mockOnCreated = jest.fn();
    render(
      <AudioPlayer isControls data={{ src: "http://example.com" }} onCreated={mockOnCreated} />
    );

    expect(mockOnCreated).toBeCalledWith(expect.objectContaining({ id: "wavesurfer.js" }));
  });
});

describe("Test actions", () => {
  test("Click play when video unloaded", () => {
    render(<AudioPlayer data={{ src: "http://example.com", wavePeaks: [0.15, -0.1, 0.8, 0.5] }} />);

    userEvent.click(screen.getAllByRole("button")[0]);
    expect(mockWaveSurfer.load).toBeCalledWith("http://example.com", [0.15, -0.1, 0.8, 0.5]);
    expect(mockWaveSurfer.play).toBeCalledWith();
  });

  test("Click play when video loaded", () => {
    render(<AudioPlayer data={{ src: "http://example.com" }} />);

    userEvent.click(screen.getByTestId("trigger-onLoading"));

    // click to play
    userEvent.click(screen.getAllByRole("button")[0]);
    expect(mockWaveSurfer.play).toBeCalledWith();
    expect(screen.getByTestId("SlackIcon")).toHaveTextContent("pause-bold");

    // click to pause
    userEvent.click(screen.getAllByRole("button")[0]);
    expect(mockWaveSurfer.pause).toBeCalledWith();
    expect(screen.getByTestId("SlackIcon")).toHaveTextContent("play-filled");
  });

  test("Click play and trigger finish", () => {
    render(<AudioPlayer data={{ src: "http://example.com" }} />);

    userEvent.click(screen.getByTestId("trigger-onLoading"));

    // click to play
    userEvent.click(screen.getAllByRole("button")[0]);
    expect(mockWaveSurfer.play).toBeCalledWith();
    expect(screen.getByTestId("SlackIcon")).toHaveTextContent("pause-bold");

    // trigger onFinish
    userEvent.click(screen.getByTestId("trigger-onFinish"));
    expect(screen.getByTestId("SlackIcon")).toHaveTextContent("play-filled");
  });

  test("Click more icon", () => {
    render(<AudioPlayer isControls data={{ src: "http://example.com" }} />);

    // click to show more memu
    userEvent.click(screen.getAllByTestId("SlackIcon")[2]);
    expect(screen.getByText("Open in new window")).toBeInTheDocument();

    // select any option to hide more menu
    userEvent.click(screen.getByText("Download")); // coverage
  });

  test("Seelct speed", () => {
    render(<AudioPlayer isControls data={{ src: "http://example.com" }} />);

    // click to show speed memu
    userEvent.click(screen.getByText("1x"));
    // select speed
    userEvent.click(screen.getByText("1.5x"));
    expect(mockWaveSurfer.setPlaybackRate).toBeCalledWith(1.5);
  });
});
