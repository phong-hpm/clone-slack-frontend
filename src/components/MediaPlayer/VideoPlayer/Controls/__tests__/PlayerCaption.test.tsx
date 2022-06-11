import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import PlayerCaption from "../PlayerCaption";

// context
import { VideoPlayerContextProvider } from "../../VideoPlayerContext";

describe("Test render", () => {
  test("When caption is off", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <PlayerCaption />
      </VideoPlayerContextProvider>
    );

    // hover to show tooltip
    userEvent.hover(screen.getByRole("button"));
    expect(screen.getByLabelText("Turn on captions")).toBeInTheDocument();
  });

  test("When caption is on", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <PlayerCaption />
      </VideoPlayerContextProvider>
    );

    userEvent.click(screen.getByRole("button"));
    // hover to show tooltip
    userEvent.hover(screen.getByRole("button"));
    expect(screen.getByLabelText("Turn off captions")).toBeInTheDocument();
  });
});
