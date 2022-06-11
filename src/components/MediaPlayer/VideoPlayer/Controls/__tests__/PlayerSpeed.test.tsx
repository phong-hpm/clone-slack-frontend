import { FC, useContext } from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import PlayerSpeed from "../PlayerSpeed";

// context
import { VideoPlayerContext, VideoPlayerContextProvider } from "../../VideoPlayerContext";

jest.mock("@mui/material/Select", () => ({ onChange }: { onChange: (e: any) => void }) => {
  return (
    <div data-testid="Select">
      <div
        data-testid="trigger-onChange"
        onClick={() => onChange({ target: { value: "1.5" } })}
      ></div>
    </div>
  );
});

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
        <ComponentSupport children={<PlayerSpeed onChange={() => {}} />} />
      </VideoPlayerContextProvider>
    );

    expect(screen.getAllByRole("button")[0]).toHaveStyle({ marginLeft: "4px" });
  });

  test("When full screen", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerSpeed onChange={() => {}} />} />
      </VideoPlayerContextProvider>
    );

    userEvent.click(screen.getByTestId("toggle-isFullScreen"));
    expect(screen.getAllByRole("button")[0]).toHaveStyle({ marginLeft: "16px" });
  });
});

describe("Test actions", () => {
  test("Select speed", () => {
    const mockonChange = jest.fn();

    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerSpeed onChange={mockonChange} />} />
      </VideoPlayerContextProvider>
    );

    // trigger onChange
    userEvent.click(screen.getByTestId("trigger-onChange"));
    expect(mockonChange).toBeCalledWith("1.5");
  });
});
