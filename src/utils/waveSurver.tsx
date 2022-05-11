export const drawBars = (waveSurfer: WaveSurfer, peaks: number[]) => {
  // clear old wave
  waveSurfer.drawer.clearWave();
  // draw new wave
  waveSurfer.drawer.drawBars(peaks, 0, 0, peaks.length);
};

export const updateBarHeight = (waveSurfer: WaveSurfer, barMinHeight: number) => {
  let peaks = [...(waveSurfer.backend as any).splitPeaks[0]];
  let maxHeight = 0;

  // get MaxHeight
  peaks.forEach((peak) => maxHeight < Math.abs(peak) && (maxHeight = Math.abs(peak)));

  // update peaks with max value is 1, min valus is barMinHeight
  peaks.forEach((peak: number, i) => {
    if (barMinHeight < Math.abs(peaks[i])) peaks[i] = peak / maxHeight;
    else peaks[i] = peaks[i] < 0 ? -barMinHeight : barMinHeight;
  });

  drawBars(waveSurfer, peaks);
};

export const buildProgressTime = (time: number) => {
  let seconds = Math.ceil(time) % 60;
  const minutes = Math.floor(Math.ceil(time) / 60);
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
};
