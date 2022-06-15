import { screen } from "@testing-library/react";
import MockWaveSurfer from "wavesurfer.js";

// components
import AudioWaveSurfer from "components/AudioWaveSurfer";

// utils
import { customRender } from "__tests__/__setups__";
import { color, rgba } from "utils/constants";
import * as utilWaveSurfer from "utils/waveSurver";

const mockWaveSurfer = MockWaveSurfer.create({ container: document.createElement("div") });

beforeEach(() => {
  jest.clearAllMocks();
  (mockWaveSurfer.on as jest.Mock).mockImplementation((_, callback) => callback());
  jest.spyOn(utilWaveSurfer, "drawBars").mockImplementation();
  jest.spyOn(utilWaveSurfer, "updateBarHeight").mockImplementation();
});

describe("Test render", () => {
  test("Wavesuerfer will be created while rendering", () => {
    // prevent fire [audioprocess]
    (mockWaveSurfer.on as jest.Mock).mockImplementation(() => {});

    const mockOnCreated = jest.fn();
    customRender(<AudioWaveSurfer onCreated={mockOnCreated} />);

    expect(screen.getByText("0:00")).toBeInTheDocument();
    expect(mockWaveSurfer.setHeight).toBeCalledWith(40);
    expect(mockOnCreated).toBeCalledWith(mockWaveSurfer);
  });

  test("When has initial progress time", () => {
    customRender(<AudioWaveSurfer progressTime="09:45" />);

    expect(screen.getByText("09:45")).toBeInTheDocument();
  });

  test("When has initial duration", () => {
    // prevent fire [audioprocess]
    (mockWaveSurfer.on as jest.Mock).mockImplementation(() => {});
    customRender(<AudioWaveSurfer duration={2 * 60 + 15} />);

    expect(screen.getByText("2:15")).toBeInTheDocument();
  });

  test("When has initial peaks", () => {
    customRender(<AudioWaveSurfer peaks={[0.15, -0.1, 0.8, 0.5]} />);

    expect(mockWaveSurfer.drawer.drawPeaks).toBeCalledWith([0.15, -0.1, 0.8, 0.5], 400, 0, 400);
  });

  test("When has onLoading and onReady listener", () => {
    const mockUpdateBarHeight = jest.spyOn(utilWaveSurfer, "updateBarHeight").mockImplementation();
    const mockOnLoading = jest.fn();
    const mockOnReady = jest.fn();
    customRender(<AudioWaveSurfer onLoading={mockOnLoading} onReady={mockOnReady} />);

    expect(mockOnLoading).toBeCalledWith();
    expect(mockOnReady).toBeCalledWith(mockWaveSurfer);
    expect(mockUpdateBarHeight).toBeCalledWith(mockWaveSurfer, 0.15);
  });

  test("When has onProgress listener", () => {
    (mockWaveSurfer.on as jest.Mock).mockImplementation((event, callback) => {
      if (event === "audioprocess") callback(15);
      else callback();
    });
    const mockOnProgress = jest.fn();
    customRender(<AudioWaveSurfer onProgress={mockOnProgress} />);

    expect(mockOnProgress).toBeCalledWith(15);
  });

  test("When has onFinish listener", () => {
    const mockOnFinish = jest.fn();
    customRender(<AudioWaveSurfer onFinish={mockOnFinish} />);

    expect(mockOnFinish).toBeCalledWith();
  });
});
