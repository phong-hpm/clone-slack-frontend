import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// components
import RecordVideoModal, {
  RecordVideoModalProps,
} from "pages/ChatPage/Conversation/ChatBox/MessageInput/Record/RecordVideo/RecordVideoModal";

jest.mock("components/SlackIcon", () => ({ icon }: { icon: string }) => (
  <div data-testid="SlackIcon">{icon}</div>
));

const devices = [
  {
    deviceId: "default",
    kind: "audioinput",
    label: "Default - Internal Microphone (Built-in)",
    groupId: "group_id_1",
  },
  {
    deviceId: "audioinput_id",
    kind: "audioinput",
    label: "Internal Microphone (Built-in)",
    groupId: "group_id_1",
  },
  {
    deviceId: "default",
    kind: "audiooutput",
    label: "Default - Internal Speakers (Built-in)",
    groupId: "group_id_1",
  },
  {
    deviceId: "audiooutput_id",
    kind: "audiooutput",
    label: "Internal Speakers (Built-in)",
    groupId: "group_id_1",
  },
  {
    deviceId: "videoinput_id",
    kind: "videoinput",
    label: "FaceTime HD Camera",
    groupId: "group_id_2",
  },
];

const mockPause = jest.fn();
const mockPlay = jest.fn();
const mockGetTracks = jest.fn();
const mockGetAudioTracks = jest.fn();
const mockGetVideoTracks = jest.fn();
const mockGetUserMedia = jest.fn();
const mockGetDisplayMedia = jest.fn();
const mockEnumerateDevices = jest.fn();
Object.assign(navigator, {
  mediaDevices: {
    getDisplayMedia: mockGetDisplayMedia,
    getUserMedia: mockGetUserMedia,
    enumerateDevices: mockEnumerateDevices,
  },
});

window.HTMLMediaElement.prototype.play = jest.fn();

const renderComponent = (props?: Partial<RecordVideoModalProps>) => {
  return render(
    <div data-testid="container">
      <RecordVideoModal isOpen onClose={() => {}} onNext={() => {}} {...props} />
    </div>
  );
};

beforeEach(() => {
  jest.spyOn(HTMLMediaElement.prototype, "pause").mockImplementation(mockPause);
  jest.spyOn(HTMLMediaElement.prototype, "play").mockImplementation(mockPlay);
  mockGetTracks.mockImplementation(() => [{ stop: jest.fn() }]);
  mockGetAudioTracks.mockImplementation(() => [{ stop: jest.fn() }]);
  mockGetVideoTracks.mockImplementation(() => [{ stop: jest.fn() }]);

  mockEnumerateDevices.mockResolvedValue(devices);
  mockGetUserMedia.mockResolvedValue({
    active: true,
    getTracks: mockGetTracks,
    getAudioTracks: mockGetAudioTracks,
    getVideoTracks: mockGetVideoTracks,
  });
  mockGetDisplayMedia.mockResolvedValue({
    active: true,
    getTracks: mockGetTracks,
    getAudioTracks: mockGetAudioTracks,
    getVideoTracks: mockGetVideoTracks,
  });
});
afterEach(() => {
  jest.clearAllMocks();
  jest.clearAllTimers();
  jest.useRealTimers();
});

const jumpToTimer = (time: number) => {
  act(() => {
    jest.advanceTimersByTime(time);
  });
};

describe("Test render", () => {
  test("When modal is not open", async () => {
    renderComponent({ isOpen: false });
    await waitFor(() => expect(screen.queryByText("Record video clip")).toBeNull());
  });
});

describe("Test Toolbar actions", () => {
  test("Toggle show/hide video", async () => {
    const mockOnClose = jest.fn();
    renderComponent({ onClose: mockOnClose });

    // wait for recoderManager loaded
    await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());

    await waitFor(() => userEvent.click(screen.getByText("video-camera")));
    await waitFor(() => userEvent.click(screen.getByText("stop-video-slashless")));
  });

  test("Toggle mute/unmuted audio", async () => {
    const mockOnClose = jest.fn();
    renderComponent({ onClose: mockOnClose });

    // wait for recoderManager loaded
    await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());
    await waitFor(() => userEvent.click(screen.getByText("Share screen")));

    await waitFor(() => userEvent.click(screen.getByText("microphone")));
    await waitFor(() => userEvent.click(screen.getByText("microphone-slashless")));
  });

  test("Change audio device on setting toolbar", async () => {
    const mockOnClose = jest.fn();
    renderComponent({ onClose: mockOnClose });

    // wait for recoderManager loaded
    await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());

    await waitFor(() => userEvent.click(screen.getByText("cog-o")));
    userEvent.hover(screen.getByText("Microphone"));
    await waitFor(() => userEvent.click(screen.getByText("Internal Microphone (Built-in)")));
  });

  test("Change video device on setting toolbar", async () => {
    const mockOnClose = jest.fn();
    renderComponent({ onClose: mockOnClose });

    // wait for recoderManager loaded
    await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());

    await waitFor(() => userEvent.click(screen.getByText("cog-o")));
    userEvent.hover(screen.getByText("Camera"));
    await waitFor(() => userEvent.click(screen.getByText("FaceTime HD Camera")));
  });
});

describe("Test actions", () => {
  test("Press esc to close", async () => {
    const mockOnClose = jest.fn();
    renderComponent({ onClose: mockOnClose });

    // wait for recoderManager loaded
    await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());

    userEvent.keyboard("{esc}");
    expect(mockOnClose).toBeCalledWith();
  });

  test("User didn't accept camera", async () => {
    console.log = jest.fn();
    mockGetUserMedia.mockRejectedValue("");
    renderComponent();

    // wait for recoderManager loaded
    await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());

    expect(console.log).toBeCalledWith(new Error("user cancelled"));
  });

  test("User didn't accept shareScreen", async () => {
    console.log = jest.fn();
    mockGetDisplayMedia.mockRejectedValue("");
    renderComponent();

    // wait for recoderManager loaded
    await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());
    await waitFor(() => userEvent.click(screen.getByText("Share screen")));

    expect(console.log).toBeCalledWith(new Error("user cancelled"));
  });

  describe("Camera", () => {
    test("Record coutdown", async () => {
      renderComponent();

      // wait for recoderManager loaded
      await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());

      jest.useFakeTimers();
      // Click Record
      userEvent.click(screen.getByText("Record"));

      // Expect coutdown
      expect(screen.getByText("Recording begins in 3...")).toBeInTheDocument();
      jumpToTimer(1000);
      expect(screen.getByText("Recording begins in 2...")).toBeInTheDocument();
      jumpToTimer(1000);
      expect(screen.getByText("Recording begins in 1...")).toBeInTheDocument();
      jumpToTimer(1000);
      expect(screen.getByText("0:00 / 5:00")).toBeInTheDocument();
      expect(screen.getByText("Stop")).toBeInTheDocument();
      expect(screen.queryByText("Record")).toBeNull();
    });

    test("Record camera and stop immediately", async () => {
      renderComponent();

      // wait for recoderManager loaded
      await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());

      jest.useFakeTimers();
      await waitFor(() => userEvent.click(screen.getByText("Record")));
      await waitFor(() => userEvent.click(screen.getByText("Stop")));

      expect(screen.queryByText(/Recording begins in/)).toBeNull();
      expect(screen.queryByText("Stop")).toBeNull();
      expect(screen.getByText("Record")).toBeInTheDocument();
    });

    test("Record camera and toggle pause/resume", async () => {
      const mockOnClose = jest.fn();
      renderComponent({ onClose: mockOnClose });

      // wait for recoderManager loaded
      await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());

      jest.useFakeTimers();
      await waitFor(() => userEvent.click(screen.getByText("Record")));
      jumpToTimer(3000);
      expect(screen.getByText("Pause")).toBeInTheDocument();

      userEvent.click(screen.getByText("Pause"));
      expect(screen.getByText("Resume")).toBeInTheDocument();

      userEvent.click(screen.getByText("Resume"));
      expect(screen.getByText("Pause")).toBeInTheDocument();
    });

    test("Record camera and stop after 5 seconds", async () => {
      const mockOnNext = jest.fn();
      renderComponent({ onNext: mockOnNext });

      // wait for recoderManager loaded
      await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());

      jest.useFakeTimers();
      await waitFor(() => userEvent.click(screen.getByText("Record")));
      // wait for 3 sec countdown
      jumpToTimer(3000);
      // wait for 5 sec recording
      jumpToTimer(5000);
      await waitFor(() => userEvent.click(screen.getByText("Stop")));
      expect(mockOnNext).toBeCalledWith("blob:http://localhost:3000/url_id", 5);
    });

    test("Record camera over 5 minutes", async () => {
      const mockOnNext = jest.fn();
      renderComponent({ onNext: mockOnNext });

      // wait for recoderManager loaded
      await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());

      jest.useFakeTimers();
      await waitFor(() => userEvent.click(screen.getByText("Record")));
      // wait for 3 sec countdown
      jumpToTimer(3000);
      // wait for 5 mins to stop recorder automatically
      jumpToTimer(300000);
      expect(mockOnNext).toBeCalledWith("blob:http://localhost:3000/url_id", 300);
    });
  });

  describe("Camera and Sharescreen", () => {
    test("Record camera + sharescreen and stop immediately", async () => {
      renderComponent();

      // wait for recoderManager loaded
      await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());
      await waitFor(() => userEvent.click(screen.getByText("Share screen")));

      await waitFor(() => userEvent.click(screen.getByText("Record")));
      await waitFor(() => userEvent.click(screen.getByText("Stop")));

      expect(screen.queryByText(/Recording begins in/)).toBeNull();
      expect(screen.queryByText("Stop")).toBeNull();
      expect(screen.getByText("Record")).toBeInTheDocument();
    });

    test("Record camera + sharescreen and toggle pause/resume", async () => {
      renderComponent();

      // wait for recoderManager loaded
      await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());
      await waitFor(() => userEvent.click(screen.getByText("Share screen")));

      jest.useFakeTimers();
      await waitFor(() => userEvent.click(screen.getByText("Record")));
      jumpToTimer(3000);
      expect(screen.getByText("Pause")).toBeInTheDocument();

      userEvent.click(screen.getByText("Pause"));
      expect(screen.getByText("Resume")).toBeInTheDocument();

      userEvent.click(screen.getByText("Resume"));
      expect(screen.getByText("Pause")).toBeInTheDocument();
    });

    test("Record camera + sharescreen and stop after 5 seconds", async () => {
      const mockOnNext = jest.fn();
      renderComponent({ onNext: mockOnNext });

      // wait for recoderManager loaded
      await waitFor(() => expect(screen.getByText("Record video clip")).toBeInTheDocument());
      await waitFor(() => userEvent.click(screen.getByText("Share screen")));

      jest.useFakeTimers();
      await waitFor(() => userEvent.click(screen.getByText("Record")));
      jumpToTimer(5000);

      await waitFor(() => userEvent.click(screen.getByText("Stop")));
      expect(mockOnNext).toBeCalledWith("blob:http://localhost:3000/url_id", expect.any(Number));
    });
  });
});
