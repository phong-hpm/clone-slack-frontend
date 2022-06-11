import { FC, useContext } from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import PlayerMoreAction from "../PlayerMoreAction";

// context
import { VideoPlayerContext, VideoPlayerContextProvider } from "../../VideoPlayerContext";

// utils
import { rgba, color } from "utils/constants";

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
        <ComponentSupport children={<PlayerMoreAction />} />
      </VideoPlayerContextProvider>
    );

    expect(screen.getByRole("button")).toHaveStyle({ background: rgba(color.MAX_DARK, 0.8) });
  });

  test("When full screen", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerMoreAction />} />
      </VideoPlayerContextProvider>
    );

    userEvent.click(screen.getByTestId("toggle-isFullScreen"));
    expect(screen.getByRole("button")).toHaveStyle({ background: "transparent" });
  });
});

describe("Test actions", () => {
  test("Click to show MoreMenu, press Esc to hide MoreMenu", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerMoreAction />} />
      </VideoPlayerContextProvider>
    );

    // click to show menu
    userEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // press esc to hide menu
    userEvent.keyboard("{esc}");
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
