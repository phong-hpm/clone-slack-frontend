import { FC, useContext, useEffect } from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import PlayerVolume from "../PlayerVolume";

// context
import { VideoPlayerContext, VideoPlayerContextProvider } from "../../VideoPlayerContext";

jest.mock(
  "@mui/material/Slider",
  () =>
    ({ onChange }: { onChange: (e: any, n: number) => void }) => {
      return (
        <div data-testid="Slider">
          <div data-testid="trigger-onChange" onClick={() => onChange({}, 0.4)}></div>
        </div>
      );
    }
);

const ComponentSupport: FC = ({ children }) => {
  const { state, updateState } = useContext(VideoPlayerContext);

  return (
    <div>
      {children}
      <div data-testid="set-volume" onClick={() => updateState({ volume: 0 })} />
    </div>
  );
};

describe("Test actions", () => {
  test("Select volumn range", () => {
    const mockonChange = jest.fn();

    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerVolume onChange={mockonChange} />} />
      </VideoPlayerContextProvider>
    );

    // hover to show volumn slider
    userEvent.hover(screen.getByRole("button"));
    //trigger change volumn
    userEvent.click(screen.getByTestId("trigger-onChange"));
    userEvent.unhover(screen.getByRole("button"));
    expect(mockonChange).toBeCalledWith(0.4);
  });

  test("Click volume button when current volumn is 1", () => {
    const mockonChange = jest.fn();

    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerVolume onChange={mockonChange} />} />
      </VideoPlayerContextProvider>
    );

    // click volume button
    userEvent.click(screen.getByRole("button"));
    expect(mockonChange).toBeCalledWith(0);
  });

  test("Click volume button when current volumn is 0", () => {
    const mockonChange = jest.fn();

    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerVolume onChange={mockonChange} />} />
      </VideoPlayerContextProvider>
    );

    userEvent.click(screen.getByTestId("set-volume"));
    // click volume button
    userEvent.click(screen.getByRole("button"));
    expect(mockonChange).toBeCalledWith(10);
  });
});
