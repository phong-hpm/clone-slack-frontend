import WaveSurfer from "wavesurfer.js";

// utils
import { rgba, color } from "utils/constants";

export const createWaveSurfer = ({ container = "#root" }: { container?: string | HTMLElement }) => {
  return WaveSurfer.create({
    container,
    cursorColor: "transparent",
    progressColor: color.HIGHLIGHT,
    waveColor: rgba(color.MAX, 0.3),
    barWidth: 3,
    barRadius: 3, // border-radious of bars
    barGap: 4, // space bewteen bar
  });
};

export const buildProgressTime = (time: number) => {
  let seconds = Math.ceil(time) % 60;
  const minutes = Math.floor(Math.ceil(time) / 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};

export const buildPeaks = (peaks: number[], barMinHeight = 0.15) => {
  if (!peaks.length) return [];

  const result: number[] = [];
  let barMaxHeight = 0;

  // get MaxHeight
  peaks.forEach((peak) => barMaxHeight < Math.abs(peak) && (barMaxHeight = Math.abs(peak)));

  // update peaks with max value is 1, min valus is barMinHeight
  peaks.forEach((peak: number, i) => {
    if (barMinHeight < Math.abs(peak)) result[i] = peak / barMaxHeight;
    else result[i] = peak < 0 ? -barMinHeight : barMinHeight;
  });

  return result;
};

export const drawBars = (waveSurfer: WaveSurfer, peaks: number[]) => {
  // clear old wave
  waveSurfer.drawer.clearWave();
  // draw new wave
  waveSurfer.drawer.drawBars(peaks, 0, 0, peaks.length);
};

export const updateBarHeight = (waveSurfer: WaveSurfer, barMinHeight: number) => {
  let splitPeaks = [...(waveSurfer.backend as any).splitPeaks[0]];
  const peaks = buildPeaks(splitPeaks, barMinHeight);
  drawBars(waveSurfer, peaks);
};
