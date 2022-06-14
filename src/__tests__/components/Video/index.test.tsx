import { fireEvent } from "@testing-library/react";

// components
import Video from "components/Video";

// utils
import { customRender } from "__tests__/__setups__";

describe("Test render", () => {
  test("Without ratio", () => {
    customRender(<Video ref={() => {}} />);

    const videoEl = document.getElementsByTagName("video")[0];
    expect(videoEl).toHaveStyle({ position: undefined });
  });

  test("With ratio", () => {
    customRender(<Video ratio={9 / 16} />);

    const videoEl = document.getElementsByTagName("video")[0];
    expect(videoEl).toHaveStyle({ position: "absolute" });
  });

  test("When video is waiting for loading", () => {
    customRender(<Video />);

    const videoEl = document.getElementsByTagName("video")[0];
    expect(videoEl.nextSibling).toBeNull();
    fireEvent.waiting(videoEl);
    expect(videoEl.nextSibling).toBeInTheDocument();
  });

  test("When video is playing", () => {
    const mockSetPlaying = jest.fn();
    customRender(<Video setPlaying={mockSetPlaying} />);

    const videoEl = document.getElementsByTagName("video")[0];
    fireEvent.canPlay(videoEl);
    fireEvent.playing(videoEl);
    expect(mockSetPlaying).toBeCalledWith(true);
  });

  test("When video is pausing", () => {
    const mockSetPlaying = jest.fn();
    customRender(<Video setPlaying={mockSetPlaying} />);

    const videoEl = document.getElementsByTagName("video")[0];
    fireEvent.pause(videoEl);
    expect(mockSetPlaying).toBeCalledWith(false);
  });
});
