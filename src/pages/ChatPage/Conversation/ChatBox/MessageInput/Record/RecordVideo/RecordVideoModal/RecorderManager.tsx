// utils
import { deviceKind, resolutions } from "utils/constants";
import { createRecorder, createThumbnails } from "utils/videoRecorder";

// types
import { ResolutionType } from "utils/_types";
import { VideoInstance } from "components/Video/_types";

class RecorderManager {
  frame = 48;
  timeFrame = 1000 / this.frame;
  renderId = 0;
  duration = 0;
  startDuration = 0;

  timeoutId?: NodeJS.Timeout;
  dutaionTimeoutId?: NodeJS.Timeout;
  enableCamera = true;
  resolution: ResolutionType = resolutions[0];
  devices: MediaDeviceInfo[] = [];
  thumbnailUrl?: string;
  chunks: Blob[] = [];

  recorder: MediaRecorder | undefined;
  cameraStream: MediaStream | undefined;
  screenStream: MediaStream | undefined;

  canvasEl = document.createElement("canvas");
  canvasCtx = this.canvasEl.getContext("2d")!;
  cameraInstanceRef: React.MutableRefObject<VideoInstance>;
  screenInstanceRef: React.MutableRefObject<VideoInstance>;
  mergedInstanceRef: React.MutableRefObject<VideoInstance>;

  render = (id: number) => {};
  onDuration: (sec: number) => void;
  selectedDevice = { audio: "", video: "" };

  constructor(
    cameraInstanceRef: React.MutableRefObject<VideoInstance>,
    screenInstanceRef: React.MutableRefObject<VideoInstance>,
    mergedInstanceRef: React.MutableRefObject<VideoInstance>,
    render: (id: number) => void,
    onDuration: (sec: number) => void
  ) {
    this.cameraInstanceRef = cameraInstanceRef;
    this.screenInstanceRef = screenInstanceRef;
    this.mergedInstanceRef = mergedInstanceRef;
    this.render = render;
    this.onDuration = onDuration;
    this.getDevices();
  }

  // this function will call [render], which will set a random number to a state of component
  forceRender() {
    this.renderId = Date.now();
    this.render(this.renderId);
  }

  async getDevices() {
    navigator.mediaDevices.enumerateDevices().then((devices) => {
      this.devices = devices;
      const videoDevices = devices.filter((device) => device.kind === deviceKind.CAMERA);
      const audioDevices = devices.filter((device) => device.kind === deviceKind.MICROPHONE);
      this.selectedDevice = { audio: audioDevices[0].deviceId, video: videoDevices[0].deviceId };

      this.forceRender();
    });
  }

  async createCameraStream(audio: { deviceId: string }, video: { deviceId: string }) {
    try {
      if (!this.cameraStream?.active) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio, video });
        this.cameraStream = stream;
      }

      this.cameraInstanceRef.current.videoEl!.volume = 0;
      this.cameraInstanceRef.current.videoEl!.srcObject = new MediaStream(this.cameraStream);
      this.createRecorder(this.cameraStream);
      this.forceRender();
    } catch {
      // throw error to outside
      throw new Error("user cancelled");
    }
  }

  async createScreenStream(audio: { deviceId: string }, video: { deviceId: string }) {
    try {
      if (!this.screenStream?.active) {
        const stream = await navigator.mediaDevices.getDisplayMedia({ audio, video });
        this.screenStream = stream;
        this.screenInstanceRef.current.videoEl!.oncanplay = () => this.mergeStreams();
      }

      this.screenInstanceRef.current.videoEl!.volume = 0;
      this.screenInstanceRef.current.videoEl!.srcObject = new MediaStream(this.screenStream);
      this.forceRender();
    } catch {
      // throw error to outside
      throw new Error("user cancelled");
    }
  }

  countDuration() {
    const now = Date.now();
    this.duration += now - this.startDuration;
    this.startDuration = now;
    this.onDuration(Math.floor(this.duration / 1000));
    this.dutaionTimeoutId = setTimeout(() => this.countDuration(), 100);
  }

  startCountDuration() {
    if (!this.dutaionTimeoutId) {
      this.startDuration = Date.now();
      this.countDuration();
    }
  }

  stopCountDuration() {
    clearTimeout(this.dutaionTimeoutId!);
    this.dutaionTimeoutId = undefined;
  }

  takeThumbnail(blob: Blob) {
    if (this.thumbnailUrl !== undefined) return;
    // we only want to take 1 thumbnail, setting [thumbnailUrl = ""]
    //    to prevent recall multiple times
    this.thumbnailUrl = "";
    createThumbnails({ blob, limit: 1 }).then((thumbs) => {
      this.thumbnailUrl = thumbs[0];
      if (this.thumbnailUrl) this.forceRender();
    });
  }

  createRecorder(stream: MediaStream) {
    const onData = (chunk: Blob) => this.chunks.push(chunk);
    this.recorder = createRecorder({ stream, onData });

    this.recorder.ondataavailable = ({ data }) => {
      if (data.size > 0) this.chunks.push(data);

      // this function will take 1 thumbnail only
      // in start time, data is too small (maybe data.size = 1)
      if (data.size > 1000) this.takeThumbnail(new Blob(this.chunks, { type: "video/webm" }));
    };
    this.recorder.onstart = () => this.startCountDuration();
    this.recorder.onresume = () => this.startCountDuration();
    this.recorder.onpause = () => this.stopCountDuration();
    this.recorder.onstop = () => {
      this.duration += Date.now() - this.startDuration;
      this.stopCountDuration();
      // when use stop video too fast, [ondataavailable] was not fired
      // re take thumnail again
      this.takeThumbnail(this.chunks[this.chunks.length]);
    };
  }

  getCameraStream() {
    return this.cameraStream;
  }

  getScreenStream() {
    return this.screenStream;
  }

  setEnableAudio(enabled: boolean) {
    this.cameraStream?.getAudioTracks().forEach((track) => (track.enabled = enabled));
    this.screenStream?.getAudioTracks().forEach((track) => (track.enabled = enabled));
  }
  setEnableVideoCamera(enabled: boolean) {
    this.enableCamera = enabled;
    this.cameraStream?.getVideoTracks().forEach((track) => (track.enabled = enabled));
  }

  start() {
    this.duration = 0;
    this.onDuration(0);

    this.recorder!.start(this.timeFrame);
  }

  stopCamera() {
    this.cameraStream?.getTracks().forEach((track) => track.stop());
  }

  stopScreen() {
    this.screenStream?.getTracks().forEach((track) => track.stop());
  }

  stop() {
    if (this.timeoutId) clearTimeout(this.timeoutId);
    this.stopScreen();
    this.stopCamera();
    this.recorder?.state === "recording" && this.recorder.stop();
  }

  async makeComposite() {
    const cameraEl = this.cameraInstanceRef.current.videoEl;
    const screenEl = this.screenInstanceRef.current.videoEl;

    if (cameraEl && screenEl) {
      const videoWidth = screenEl.videoWidth || 1;
      const videoHeight = screenEl.videoHeight || 1;

      // prepair canvas
      this.canvasCtx.save();
      this.canvasEl.setAttribute("width", `${videoWidth}px`);
      this.canvasEl.setAttribute("height", `${videoHeight}px`);
      this.canvasCtx.clearRect(0, 0, videoWidth, videoHeight);

      // draw screen onto canvas
      this.canvasCtx.scale(1, 1);
      this.canvasCtx.drawImage(screenEl, 0, 0, videoWidth, videoHeight);
      // draw camera onto canvas
      if (this.enableCamera) {
        const { width: cameraWidth, height: cameraHeight } = cameraEl.getBoundingClientRect();
        const { width: screenWidth, height: screenHeight } = screenEl.getBoundingClientRect();
        const ratioWidthCanvas = videoWidth / screenWidth;
        const ratioHeightCanvas = videoHeight / screenHeight;

        // mirror camera
        this.canvasCtx.scale(-1, 1);
        this.canvasCtx.drawImage(
          cameraEl,
          -Math.floor(videoWidth - ratioWidthCanvas * cameraWidth - ratioWidthCanvas * 10),
          Math.floor(videoHeight - ratioHeightCanvas * cameraHeight - ratioHeightCanvas * 10),
          -ratioWidthCanvas * cameraWidth,
          ratioHeightCanvas * cameraHeight
        );
      }

      // after drawing screen and camera, get image from context
      let imageData = this.canvasCtx.getImageData(0, 0, videoWidth, videoHeight);

      // paint data to canvas
      this.canvasCtx.putImageData(imageData, 0, 0);

      this.canvasCtx.restore();
      this.timeoutId = setTimeout(() => this.makeComposite(), this.timeFrame);
    }
  }

  async mergeStreams() {
    await this.makeComposite();

    const audioCTX = new AudioContext();
    const audioDES = audioCTX.createMediaStreamDestination();
    let canvasStream = this.canvasEl.captureStream();
    let audioStreams = [
      ...(this.cameraStream ? this.cameraStream.getAudioTracks() : []),
      ...(this.screenStream ? this.screenStream.getAudioTracks() : []),
    ];
    const audioTracks = [];
    audioTracks.push(audioCTX.createMediaStreamSource(new MediaStream([audioStreams[0]])));
    if (audioStreams.length > 1) {
      audioTracks.push(audioCTX.createMediaStreamSource(new MediaStream([audioStreams[1]])));
    }
    audioTracks.map((track) => track.connect(audioDES));
    let mergedStream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...audioDES.stream.getTracks(),
    ]);

    this.cameraInstanceRef.current.videoEl!.volume = 0;
    this.screenInstanceRef.current.videoEl!.volume = 0;
    this.mergedInstanceRef.current.videoEl!.volume = 0;
    this.mergedInstanceRef.current.videoEl!.srcObject = mergedStream;

    this.createRecorder(mergedStream);
  }
}

export default RecorderManager;
