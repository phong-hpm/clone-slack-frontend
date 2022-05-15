import { v4 as uuid } from "uuid";

// types
import { MessageFileType } from "store/slices/_types";
import { ResolutionType } from "./_types";

export const createRecoder = (
  stream: MediaStream,
  onDuraionChange: (duration: number) => void,
  callback: (file: MessageFileType) => void
) => {
  let currentDuration = 0; // milisecond
  let durationSeconds = 0;
  let intervalId: NodeJS.Timer;
  const recordedChunks: Blob[] = [];
  const mediaRecoder = new MediaRecorder(stream);

  const startCountDuration = () => {
    intervalId = setInterval(() => {
      currentDuration += 10;
      if (Math.floor(currentDuration / 1000) !== durationSeconds) {
        durationSeconds = Math.floor(currentDuration / 1000);
        onDuraionChange(durationSeconds);
      }
    }, 10);
  };

  mediaRecoder.onstart = () => startCountDuration();
  mediaRecoder.onpause = () => clearInterval(intervalId);
  mediaRecoder.onresume = () => startCountDuration();

  // ondata recorder listener
  mediaRecoder.ondataavailable = (event) => {
    if (event.data.size > 0) recordedChunks.push(event.data);
  };

  // onstop recorder listener
  mediaRecoder.onstop = () => {
    clearInterval(intervalId);
    const blob = new Blob(recordedChunks);
    callback({
      id: `F-${uuid()}`,
      url: URL.createObjectURL(blob),
      created: Date.now(),
      fileType: "webm",
      type: "video",
      size: blob.size,
      mineType: "video/webm",
      duration: durationSeconds,
    });
  };

  return mediaRecoder;
};

export const createCameraRecorder = async (
  audioDeviceId: string,
  videoDeviceId: string,
  resolution: ResolutionType,
  onDuraionChange: (duration: number) => void,
  callback: (file: MessageFileType) => void
) => {
  // get media stream
  const stream = await navigator.mediaDevices.getUserMedia({
    audio: { deviceId: audioDeviceId },
    video: { ...resolution, deviceId: videoDeviceId },
  });

  const mediaRecoder = createRecoder(stream, onDuraionChange, callback);

  return { stream, mediaRecoder };
};

export const createShareScreenRecorder = async (
  audioDeviceId: string,
  videoDeviceId: string,
  resolution: ResolutionType,
  onDuraionChange: (duration: number) => void,
  callback: (file: MessageFileType) => void
) => {
  // get media stream
  const stream = await navigator.mediaDevices.getDisplayMedia({
    audio: { deviceId: audioDeviceId },
    video: { ...resolution, deviceId: videoDeviceId },
  });

  const mediaRecoder = createRecoder(stream, onDuraionChange, callback);

  return { stream, mediaRecoder };
};

// we should take thumbnails from blob:url
// if we pass a network url, it will take so much time to finish
export const createThumbnails = ({
  src,
  limit = 5,
}: {
  src: string;
  limit?: number;
}): Promise<string[]> => {
  const video = document.createElement("video");
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d")!;

  return new Promise((resolve) => {
    try {
      video.src = src;
      let currentThumbnail = 0;
      const thumbnailUrls: string[] = [];

      // will be fire after video loaded url with new currentTime
      video.oncanplay = () => {
        // the metadata is loaded after the Video. So the duration is not available
        if (video.duration === Infinity) return (video.currentTime = 1);

        c.width = video.videoWidth;
        c.height = video.videoHeight;
        ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        c.toBlob((blob) => {
          // if video.currentTime is 0, thumbnail will be a empty picture, so ignore it
          if (video.currentTime && blob) thumbnailUrls.push(URL.createObjectURL(blob));

          console.log("thumbs", thumbnailUrls);
          // finish function
          if (currentThumbnail >= limit) resolve(thumbnailUrls);
          // set next currentTime, minimum is 1
          else video.currentTime = Math.ceil(currentThumbnail * (video.duration / limit)) || 1;

          currentThumbnail++;
        });
      };
    } catch {
      resolve([]);
    }
  });
};
