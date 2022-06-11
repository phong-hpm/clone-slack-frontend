import { FC, useContext } from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import PlayerPlayPause from "../PlayerPlayPause";

// context
import { VideoPlayerContext, VideoPlayerContextProvider } from "../../VideoPlayerContext";

// utils
import { rgba, color } from "utils/constants";

jest.mock("components/SlackIcon", () => ({ icon }: { icon: string }) => (
  <div data-testid="SlackIcon">{icon}</div>
));

const ComponentSupport: FC = ({ children }) => {
  const { state, updateState } = useContext(VideoPlayerContext);

  return (
    <div>
      {children}
      <div
        data-testid="toggle-isFullScreen"
        onClick={() => updateState({ isFullScreen: !state.isFullScreen })}
      />
      <div
        data-testid="toggle-isPlaying"
        onClick={() => updateState({ isPlaying: !state.isPlaying })}
      />
    </div>
  );
};

describe("Test render", () => {
  test("When not full screen", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerPlayPause onClick={() => {}} />} />
      </VideoPlayerContextProvider>
    );

    expect(screen.getByRole("button")).toHaveStyle({ background: rgba(color.MAX_DARK, 0.8) });
    expect(screen.getByText("0:00")).toBeInTheDocument();

    expect(screen.getByTestId("SlackIcon")).toHaveTextContent("play-filled");
    userEvent.click(screen.getByTestId("toggle-isPlaying"));
    expect(screen.getByTestId("SlackIcon")).toHaveTextContent("pause");
  });

  test("When full screen", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerPlayPause isHover onClick={() => {}} />} />
      </VideoPlayerContextProvider>
    );

    userEvent.click(screen.getByTestId("toggle-isFullScreen"));
    expect(screen.getByRole("button")).toHaveStyle({ background: "transparent" });
    expect(screen.queryByText("0:00")).toBeNull();

    expect(screen.getByTestId("SlackIcon")).toHaveTextContent("play");
    userEvent.click(screen.getByTestId("toggle-isPlaying"));
    expect(screen.getByTestId("SlackIcon")).toHaveTextContent("pause");
  });
});

describe("Test actions", () => {
  test("Click to play", () => {
    const mockOnClick = jest.fn();

    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerPlayPause onClick={mockOnClick} />} />
      </VideoPlayerContextProvider>
    );

    // click to play
    userEvent.click(screen.getByRole("button"));
    expect(mockOnClick).toBeCalledWith(expect.objectContaining({ type: "click" }));
  });
});
