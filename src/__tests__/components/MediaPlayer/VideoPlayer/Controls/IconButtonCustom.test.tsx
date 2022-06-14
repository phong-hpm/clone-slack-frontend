import { FC, useContext } from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import IconButtonCustom from "components/MediaPlayer/VideoPlayer/Controls/IconButtonCustom";

// context
import {
  VideoPlayerContext,
  VideoPlayerContextProvider,
} from "components/MediaPlayer/VideoPlayer/VideoPlayerContext";

const ComponentSupport: FC = ({ children }) => {
  const { state, updateState } = useContext(VideoPlayerContext);

  return (
    <div>
      {children}
      <div
        data-testid="toggle-isFullScreen"
        onClick={() => updateState({ isFullScreen: !state.isFullScreen })}
      />
    </div>
  );
};

describe("Test render", () => {
  test("When not full screen", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<IconButtonCustom />} />
      </VideoPlayerContextProvider>
    );

    expect(screen.getByRole("button")).toHaveStyle({ marginLeft: "4px" });
  });

  test("When full screen", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<IconButtonCustom />} />
      </VideoPlayerContextProvider>
    );

    userEvent.click(screen.getByTestId("toggle-isFullScreen"));
    expect(screen.getByRole("button")).toHaveStyle({ marginLeft: "16px" });
  });
});
