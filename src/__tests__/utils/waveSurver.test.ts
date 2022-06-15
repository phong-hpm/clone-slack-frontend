import MockWaveSurder from "wavesurfer.js";

// utils
import { buildProgressTime, createWaveSurfer, drawBars, updateBarHeight } from "utils/waveSurver";

// these test cases exist for coverage only
// they will fire some functions of [wavesurfer.js]
// we don't need to test them
describe("coverage", () => {
  test("createWaveSurfer", () => {
    createWaveSurfer({});
  });
});

describe("waveSurver", () => {
  const peaks = [0.15, -0.1, 0.8, 0.5];
  const mockWaveSurfer = MockWaveSurder.create({ container: document.createElement("div") });

  test("buildProgressTime", () => {
    expect(buildProgressTime(58)).toEqual("0:58");
    expect(buildProgressTime(128)).toEqual("2:08");
  });

  test("drawBars", () => {
    drawBars(mockWaveSurfer as any, peaks);

    expect(mockWaveSurfer.drawer.clearWave).toBeCalledWith();
    expect(mockWaveSurfer.drawer.drawBars).toBeCalledWith(peaks, 0, 0, peaks.length);
  });

  test("updateBarHeight when peaks has value", () => {
    // update bar with
    updateBarHeight(mockWaveSurfer as any, 0.2);
    expect(mockWaveSurfer.drawer.clearWave).toBeCalledWith();
    expect(mockWaveSurfer.drawer.drawBars).toBeCalledWith(
      [0.2, -0.2, 1, 0.625],
      0,
      0,
      peaks.length
    );
  });

  test("updateBarHeight when peaks is empty", () => {
    updateBarHeight(
      { ...mockWaveSurfer, backend: { splitPeaks: [[]] } } as any,
      undefined as unknown as number
    );

    expect(mockWaveSurfer.drawer.clearWave).toBeCalledWith();
    expect(mockWaveSurfer.drawer.drawBars).toBeCalledWith([], 0, 0, 0);
  });
});
