import { FC, useContext, useEffect } from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import PlayerTranscript from "../PlayerTranscript";

// context
import { VideoPlayerContext, VideoPlayerContextProvider } from "../../VideoPlayerContext";

jest.mock("@mui/material/Select", () => ({ onChange }: { onChange: (e: any) => void }) => {
  return (
    <div data-testid="Select">
      <div data-testid="trigger-onChange" onClick={() => onChange({ target: { value: "1.5" } })} />
    </div>
  );
});

const ComponentSupport: FC = ({ children }) => {
  const { state, updateState } = useContext(VideoPlayerContext);

  useEffect(() => {
    updateState({
      userOwner: {} as any,
      createdTime: Date.now(),
      scripts: [{ label: "Start video", currentTime: 62 }],
    });
  }, [updateState]);

  return (
    <div>
      {children}
      <div
        data-testid="toggle-isFullScreen"
        onClick={() => updateState({ isFullScreen: !state.isFullScreen })}
      />
      <div data-testid="isShowThreadScriptBar">{String(state.isShowThreadScriptBar)}</div>
    </div>
  );
};

describe("Test render", () => {
  test("When not full screen", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerTranscript onChange={() => {}} />} />
      </VideoPlayerContextProvider>
    );

    expect(screen.getAllByRole("button")[0]).toHaveStyle({ marginLeft: "4px" });
  });

  test("When full screen", () => {
    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerTranscript onChange={() => {}} />} />
      </VideoPlayerContextProvider>
    );

    userEvent.click(screen.getByTestId("toggle-isFullScreen"));
    expect(screen.getAllByRole("button")[0]).toHaveStyle({ marginLeft: "16px" });
  });
});

describe("Test actions", () => {
  test("Select script when not full screen", () => {
    const mockonChange = jest.fn();

    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerTranscript onChange={mockonChange} />} />
      </VideoPlayerContextProvider>
    );

    // click to open modal
    userEvent.click(screen.getByRole("button"));
    expect(screen.getByText("Transcript")).toBeInTheDocument();

    // select script
    userEvent.click(screen.getByText("1:02"));
    expect(mockonChange).toBeCalledWith(62);

    // press esc to close modal
    userEvent.keyboard("{esc}");
    expect(screen.queryByText("Transcript")).toBeNull();
  });

  test("Select script when full screen", () => {
    const mockonChange = jest.fn();

    render(
      <VideoPlayerContextProvider dataProps={{} as any}>
        <ComponentSupport children={<PlayerTranscript onChange={mockonChange} />} />
      </VideoPlayerContextProvider>
    );

    userEvent.click(screen.getByTestId("toggle-isFullScreen"));

    // click to open modal
    userEvent.click(screen.getByRole("button"));
    expect(screen.getByTestId("isShowThreadScriptBar")).toHaveTextContent("true");
  });
});
