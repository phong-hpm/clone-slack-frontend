import { FC, useContext, useEffect } from "react";
import { screen, render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import FullScreenModal from "../FullScreenModal";

// context
import { VideoPlayerContext, VideoPlayerContextProvider } from "../VideoPlayerContext";

// [onAfterOpen] props of {react-table} doesn't work in test environment
// we have to mock Modal to test this component
jest.mock("components/Modal/Modal", () => (props: any) => {
  jest.requireActual("react").useEffect(() => {
    if (props.isOpen) props.onAfterOpen?.();
  }, [props.isOpen]);

  if (!props.isOpen) return <></>;
  return (
    <div>
      {props.children}
      <div
        data-testid="fire-onClose"
        onClick={() => {
          props.onClose?.();
          props.onAfterClose?.();
        }}
      />
    </div>
  );
});

const generateMockPlayerInstace = () => ({
  containerEl: document.createElement("div"),
  video: {
    containerEl: document.createElement("div"),
    videoEl: document.createElement("video"),
  },
});

let mockPlayerInstance = generateMockPlayerInstace();

const ComponentSupport: FC = ({ children }) => {
  const { state, updateState } = useContext(VideoPlayerContext);

  useEffect(() => {
    updateState({
      channelName: "channel name",
      isFullScreen: true,
      isShowThreadScriptBar: true,
      scripts: [{ label: "Start video", currentTime: 10 }],
    });
  }, []);

  return (
    <div>
      {children}
      <div data-testid="isFullScreen" children={String(state.isFullScreen)} />
      <div
        data-testid="toggle-isFullScreen"
        onClick={() => updateState({ isFullScreen: !state.isFullScreen })}
      />
    </div>
  );
};

const renderComponent = ({
  onClose,
  onAfterOpen,
  playerInstance = mockPlayerInstance,
}: any = {}) => {
  return render(
    <VideoPlayerContextProvider dataProps={{} as any}>
      <ComponentSupport
        children={
          <FullScreenModal
            onClose={onClose}
            onAfterOpen={onAfterOpen}
            playerInstance={playerInstance}
          />
        }
      />
    </VideoPlayerContextProvider>
  );
};

beforeEach(() => {
  mockPlayerInstance = generateMockPlayerInstace();
  jest.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(() => ({
    width: 200,
    height: 200,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    x: 0,
    y: 0,
    toJSON: () => {},
  }));
});

describe("Test render", () => {
  test("When video element is not undefined, video size will be updated", () => {
    const mockOnAfterOpen = jest.fn();
    renderComponent({ onAfterOpen: mockOnAfterOpen });

    expect(mockOnAfterOpen).toBeCalledWith(expect.any(HTMLDivElement));
    expect(mockPlayerInstance.video.videoEl.style.maxWidth).toEqual("200px");
    expect(mockPlayerInstance.video.videoEl.style.maxHeight).toEqual("200px");
    expect(mockPlayerInstance.video.videoEl.style.opacity).toEqual("1");
  });

  test("When video element is undefined", () => {
    const mockOnAfterOpen = jest.fn();
    renderComponent({
      onAfterOpen: mockOnAfterOpen,
      playerInstance: { ...mockPlayerInstance, video: {} },
    });

    expect(mockOnAfterOpen).toBeCalledWith(expect.any(HTMLDivElement));
  });
});

describe("Test actions", () => {
  test("Click on script", () => {
    renderComponent();

    userEvent.click(screen.getByText("0:10"));
    userEvent.click(screen.getByText("Start video"));
    expect(mockPlayerInstance.video.videoEl.currentTime).toEqual(10);
  });

  test("Click on Thread Tab", () => {
    renderComponent();

    userEvent.click(screen.getByText("Thread"));
    userEvent.click(screen.getByText("Start video"));
    expect(screen.getByText("Thread tab")).toBeInTheDocument();
  });

  test("Click close", () => {
    const mockOnClose = jest.fn();
    renderComponent({ onClose: mockOnClose });

    userEvent.click(screen.getByTestId("fire-onClose"));
    expect(mockOnClose).toBeCalledWith();
    expect(screen.getByTestId("isFullScreen")).toHaveTextContent("false");
    expect(mockPlayerInstance.containerEl.childNodes).toHaveLength(1);
  });

  test("Click close when video element is undefined", () => {
    const mockOnClose = jest.fn();
    renderComponent({ onClose: mockOnClose, playerInstance: { ...mockPlayerInstance, video: {} } });

    userEvent.click(screen.getByTestId("fire-onClose"));
    expect(mockOnClose).toBeCalledWith();
    expect(screen.getByTestId("isFullScreen")).toHaveTextContent("false");
    expect(mockPlayerInstance.containerEl.childNodes).toHaveLength(0);
  });
});
