import { FC, useEffect, useState } from "react";

// components
import WaveSurfer from "wavesurfer.js";
import { Box, Typography } from "@mui/material";

// utils
import { color, rgba } from "utils/constants";
import { updateBarHeight, buildProgressTime } from "utils/waveSurver";

export interface AudioWaveSurferProps {
  height?: number;
  width?: number;
  barMinHeight?: number;
  progressTime?: string;
  peaks?: number[];
  duration?: number; // seconds
  onLoading?: (percent: number) => void;
  onProgress?: (time: number) => void;
  onFinish?: () => void;
  onReady?: (waveSurfer: WaveSurfer) => void;
  onCreated?: (waveSurfer: WaveSurfer) => void;
}

const AudioWaveSurfer: FC<AudioWaveSurferProps> = ({
  height = 40,
  width = 200,
  barMinHeight = 0.15,
  duration,
  progressTime: progressTimeProp,
  peaks,
  onLoading,
  onProgress,
  onFinish,
  onReady,
  onCreated,
}) => {
  const [waveSurfer, setWaveSurfer] = useState<WaveSurfer>();
  const [containerEl, setContainerEl] = useState<HTMLDivElement>();
  const [progressTime, setProgressTime] = useState("0:00");

  // update duration before start
  useEffect(() => {
    if (!duration) return;
    setProgressTime(buildProgressTime(duration));
  }, [duration]);

  // this logic will be call only 1 time, when container element rendered
  useEffect(() => {
    if (!containerEl) return;
    const ws = WaveSurfer.create({
      container: containerEl,
      cursorColor: "transparent",
      progressColor: color.HIGHLIGHT,
      waveColor: rgba(color.MAX, 0.3),
      barWidth: 3,
      barRadius: 3, // border-radious of bars
      barGap: 4, // space bewteen bar
    });

    setWaveSurfer(ws);
  }, [containerEl]);

  // trigger onCreated after wavesurfer was created
  useEffect(() => {
    if (!waveSurfer || !onCreated) return;
    onCreated(waveSurfer);
  }, [waveSurfer, onCreated]);

  // update wavesurfer height
  useEffect(() => {
    waveSurfer?.setHeight(height);
  }, [waveSurfer, height]);

  // draw peaks after created
  useEffect(() => {
    if (!peaks?.length) return;
    waveSurfer?.drawer.drawPeaks(peaks, width * 2, 0, width * 2);
  }, [waveSurfer, width, peaks]);

  // add loading event, which will be call when url is loading, value is in [0..100]
  useEffect(() => {
    if (!onLoading) return;
    waveSurfer?.on("loading", onLoading);
  }, [waveSurfer, onLoading]);

  // add ready event, which will be call after url was loaded
  useEffect(() => {
    waveSurfer?.on("ready", () => {
      if (!waveSurfer) return;
      // only update bar height if we don't have peaks before
      !peaks && updateBarHeight(waveSurfer, barMinHeight);
      onReady && onReady(waveSurfer);
    });
  }, [waveSurfer, peaks, barMinHeight, onReady]);

  // add audioprocess event, which will be call when audio is running, value is seconds
  useEffect(() => {
    // controlled
    if (progressTimeProp) return;

    // uncontrolled
    waveSurfer?.on("audioprocess", (time: number) => {
      setProgressTime(buildProgressTime(time));
      onProgress && onProgress(time);
    });
  }, [waveSurfer, progressTimeProp, onProgress]);

  // add loading event, which will be call after audio finished running
  useEffect(() => {
    if (!onFinish) return;
    waveSurfer?.on("finish", onFinish);
  }, [waveSurfer, onFinish]);

  return (
    <Box display="flex" alignItems="center">
      <Box>
        <Box ref={setContainerEl} height={height} width={width} sx={{ cursor: "pointer" }} />
      </Box>
      <Box ml={1.5}>
        <Typography variant="h5" fontWeight={700}>
          {progressTimeProp || progressTime}
        </Typography>
      </Box>
    </Box>
  );
};

export default AudioWaveSurfer;
