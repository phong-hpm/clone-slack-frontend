import { FC, useContext } from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import PlayerDuration from "../PlayerDuration";

// context
import { VideoPlayerContext, VideoPlayerContextProvider } from "../../VideoPlayerContext";

const ComponentSupport: FC = ({ children }) => {
  const { updateState } = useContext(VideoPlayerContext);

  return (
    <div>
      {children}
      <div
        data-testid="set-duration"
        onClick={() => updateState({ currentTime: 35, duration: 129 })}
      />
    </div>
  );
};

describe("Test render", () => {
  test("Render PlayerDuration", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerDuration />} />
      </VideoPlayerContextProvider>
    );

    userEvent.click(screen.getByTestId("set-duration"));
    expect(screen.getByText("0:35 / 2:09")).toBeInTheDocument();
  });
});
