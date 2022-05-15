// utils
import { deviceKind, resolutions } from "utils/constants";
import { createRecorder } from "utils/videoRecorder";

// types
import { ResolutionType } from "utils/_types";

class RecorderManager {
  frame = 48;
  renderId: number = 0;
  timeoutId?: NodeJS.Timeout;
  enableCamera = true;
  resolution: ResolutionType = resolutions[0];
  devices: MediaDeviceInfo[] = [];
  chunks: Blob[] = [];

  recorder: MediaRecorder | undefined;
  cameraStream: MediaStream | undefined;
  screenStream: MediaStream | undefined;

  canvasEl = document.createElement("canvas");
  canvasCtx = this.canvasEl.getContext("2d")!;
  cameraRef: React.RefObject<HTMLVideoElement>;
  screenRef: React.RefObject<HTMLVideoElement>;
  mergedRef: React.RefObject<HTMLVideoElement>;

  render = (id: number) => {};
  onDuration: (sec: number) => void;
  selectedDevice = { audio: "", video: "" };

  constructor(
    cameraRef: React.RefObject<HTMLVideoElement>,
    screenRef: React.RefObject<HTMLVideoElement>,
    mergedRef: React.RefObject<HTMLVideoElement>,
    render: (id: number) => void,
    onDuration: (sec: number) => void
  ) {
    this.cameraRef = cameraRef;
    this.screenRef = screenRef;
    this.mergedRef = mergedRef;
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
    if (!this.cameraStream?.active) {
      const stream = await navigator.mediaDevices.getUserMedia({ audio, video });
      this.cameraStream = stream;
    }

    this.cameraRef.current!.volume = 0;
    this.cameraRef.current!.srcObject = new MediaStream(this.cameraStream);
    this.createRecorder(this.cameraStream);
    this.forceRender();
  }

  async createScreenStream(audio: { deviceId: string }, video: { deviceId: string }) {
    if (!this.screenStream?.active) {
      const stream = await navigator.mediaDevices.getDisplayMedia({ audio, video });
      this.screenStream = stream;
      this.screenRef.current!.oncanplay = () => this.mergeStreams();
    }

    this.screenRef.current!.volume = 0;
    this.screenRef.current!.srcObject = new MediaStream(this.screenStream);
    this.forceRender();
  }

  createRecorder(stream: MediaStream) {
    const onData = (chunk: Blob) => this.chunks.push(chunk);
    this.recorder = createRecorder({ stream, onDuration: this.onDuration, onData });
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
    this.recorder!.start(1000 / this.frame);
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

  makeComposite() {
    const cameraEl = this.cameraRef.current;
    const screenEl = this.screenRef.current;

    if (screenEl && cameraEl) {
      const { videoWidth, videoHeight } = screenEl;
      if (!videoWidth || videoHeight) return;

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
        // mirror camera
        this.canvasCtx.scale(-1, 1);
        this.canvasCtx.drawImage(
          cameraEl,
          -Math.floor(videoWidth - videoWidth / 5),
          Math.floor(videoHeight - videoHeight / 5),
          -Math.floor(videoWidth / 5.5),
          Math.floor(videoHeight / 6)
        );
      }

      // after drawing screen and camera, get image from context
      let imageData = this.canvasCtx.getImageData(0, 0, videoWidth, videoHeight);

      // paint data to canvas
      this.canvasCtx.putImageData(imageData, 0, 0);

      this.canvasCtx.restore();
      this.timeoutId = setTimeout(() => this.makeComposite(), 1000 / this.frame);
    }
  }

  mergeStreams() {
    this.makeComposite();

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

    this.mergedRef.current!.volume = 0;
    this.mergedRef.current!.srcObject = mergedStream;

    this.cameraRef.current!.volume = 0;
    this.screenRef.current!.volume = 0;

    this.createRecorder(mergedStream);
  }
}

export default RecorderManager;
