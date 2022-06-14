import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import PlayerExpand from "components/MediaPlayer/VideoPlayer/Controls/PlayerExpand";

// context
import { VideoPlayerContextProvider } from "components/MediaPlayer/VideoPlayer/VideoPlayerContext";

// utils
import { rgba, color } from "utils/constants";

describe("Test render", () => {
  test("When not full screen", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <PlayerExpand />
      </VideoPlayerContextProvider>
    );

    // hover to show tooltip
    userEvent.hover(screen.getByRole("button"));
    expect(screen.getByLabelText("Expand")).toBeInTheDocument();

    expect(screen.getByRole("button")).toHaveStyle({ background: rgba(color.MAX_DARK, 0.8) });
  });

  test("When full screen", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <PlayerExpand />
      </VideoPlayerContextProvider>
    );

    // click expand
    userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("button")).toHaveStyle({ background: "transparent" });

    // hover to show tooltip
    userEvent.hover(screen.getByRole("button"));
    expect(screen.getByLabelText("Expand")).toBeInTheDocument();
  });
});
