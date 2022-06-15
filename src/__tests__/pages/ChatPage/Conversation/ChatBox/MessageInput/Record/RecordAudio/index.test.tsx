import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useContext } from "react";
import MockWaveSurfer from "wavesurfer.js";

// contexts
import InputContext, {
  MessageInputProvider,
} from "pages/ChatPage/Conversation/ChatBox/MessageInput/InputContext";

// components
import RecordAudio, {
  RecordAudioProps,
} from "pages/ChatPage/Conversation/ChatBox/MessageInput/Record/RecordAudio";

// utils
import * as waveSurferUtils from "utils/waveSurver";
import { AudioWaveSurferProps } from "components/AudioWaveSurfer";

const mockWaveSurfer = MockWaveSurfer.create({ container: document.createElement("div") });
mockWaveSurfer.microphone.stop = (() => mockWaveSurfer.stop()) as any;
jest.mock("components/SlackIcon", () => ({ icon }: { icon: string }) => (
  <div data-testid="SlackIcon">{icon}</div>
));

jest.mock("components/AudioWaveSurfer", () => {
  const AudioWaveSurfer = (props: AudioWaveSurferProps) => {
    jest.requireActual("react").useEffect(() => {
      props.onCreated?.(mockWaveSurfer);
    }, []);

    return (
      <div data-testid="AudioWaveSurfer">
        <div data-testid="progressTime" children={props.progressTime} />
      </div>
    );
  };

  return {
    __esModule: true,
    default: AudioWaveSurfer,
  };
});

const jumpToTimer = (time: number) => {
  act(() => {
    jest.advanceTimersByTime(time);
  });
};

const ComponentSupport = (props?: { getInputFiles?: Function }) => {
  const { appState } = useContext(InputContext);

  return (
    <div>
      <div
        // when fire this Click, testcase can know what values [inputFiles] has
        data-testid="fire-getInputFiles"
        onClick={() => props?.getInputFiles?.(appState.inputFiles)}
      />
    </div>
  );
};

const renderComponent = (props?: Partial<RecordAudioProps>, getInputFiles?: Function) => {
  return render(
    <MessageInputProvider configActions={{}}>
      <ComponentSupport getInputFiles={getInputFiles} />
      <RecordAudio isOpen onClose={() => {}} {...props} />
    </MessageInputProvider>
  );
};

beforeEach(() => {
  jest.spyOn(waveSurferUtils, "buildPeaks").mockImplementation(() => []);

  (mockWaveSurfer.once as jest.Mock).mockImplementation((_, cb) => cb());
});

describe("Test actions", () => {
  test("Click save", async () => {
    jest.useFakeTimers();
    const stream = { stop: () => {} };
    (mockWaveSurfer.microphone.on as jest.Mock).mockImplementation((_, cb) => cb(stream));
    const mockGetInputFiles = jest.fn();

    renderComponent({}, mockGetInputFiles);

    expect(screen.getByTestId("AudioWaveSurfer")).toBeInTheDocument();

    // Click save
    await waitFor(() => userEvent.click(screen.getByText("check-large-bold")));
    jumpToTimer(20000);
    // [MicrophonePlugin] will fire [MediaRecorder.stop] when it is stopping
    // but we mocked MicrophonePlugin, so we have to fire stream.stop manually
    act(() => stream.stop());

    expect(screen.getByTestId("progressTime")).toHaveTextContent("0:21");

    // Fire this one to check [inputFiles] state
    userEvent.click(screen.getByTestId("fire-getInputFiles"));
    expect(mockGetInputFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          createdTime: expect.any(Number),
          duration: 21,
          mineType: "audio/webm",
          type: "audio",
          url: "blob:http://localhost:3000/url_id",
          wavePeaks: [],
        }),
      ])
    );
  });
});
