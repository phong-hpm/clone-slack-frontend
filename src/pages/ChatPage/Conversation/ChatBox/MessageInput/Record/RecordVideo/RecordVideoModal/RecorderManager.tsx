// utils
import { deviceKind, resolutions } from "utils/constants";

// types
import { ResolutionType } from "utils/_types";

class RecorderManager {
  frame = 24;
  timeFrame = 1000 / this.frame;
  renderId = 0;
  duration = 0;
  startDuration = 0;
  ratio = 720 / 1280;

  timeoutId?: NodeJS.Timeout;
  durationTimeoutId?: NodeJS.Timeout;
  enableCamera = true;
  resolution: ResolutionType = resolutions[0];
  devices: MediaDeviceInfo[] = [];
  chunks: Blob[] = [];

  recorder: MediaRecorder | undefined;
  cameraStream: MediaStream | undefined;
  screenStream: MediaStream | undefined;

  canvasEl = document.createElement("canvas");
  canvasCtx = this.canvasEl.getContext("2d")!;
  cameraInstanceRef: React.MutableRefObject<HTMLVideoElement | null>;
  screenInstanceRef: React.MutableRefObject<HTMLVideoElement | null>;
  mergedInstanceRef: React.MutableRefObject<HTMLVideoElement | null>;

  render = (id: number) => {};
  onDuration: (sec: number) => void;
  selectedDevice = { audio: "", video: "" };

  constructor(
    cameraInstanceRef: React.MutableRefObject<HTMLVideoElement | null>,
    screenInstanceRef: React.MutableRefObject<HTMLVideoElement | null>,
    mergedInstanceRef: React.MutableRefObject<HTMLVideoElement | null>,
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
        this.cameraStream = await navigator.mediaDevices.getUserMedia({
          audio,
          video: { ...video, frameRate: { ideal: this.frame }, aspectRatio: 16 / 9 },
        });
      }

      this.cameraInstanceRef.current!.volume = 0;
      this.cameraInstanceRef.current!.srcObject = new MediaStream(this.cameraStream);
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
        const stream = await navigator.mediaDevices.getDisplayMedia({
          audio,
          video: { ...video, frameRate: { ideal: this.frame }, aspectRatio: 16 / 9 },
        });
        this.screenStream = stream;
        this.screenInstanceRef.current!.oncanplay = () => this.mergeStreams();
      }

      this.screenInstanceRef.current!.volume = 0;
      this.screenInstanceRef.current!.srcObject = new MediaStream(this.screenStream);
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
    this.durationTimeoutId = setTimeout(() => this.countDuration(), 100);
  }

  startCountDuration() {
    if (!this.durationTimeoutId) {
      this.startDuration = Date.now();
      this.countDuration();
    }
  }

  stopCountDuration() {
    clearTimeout(this.durationTimeoutId!);
    this.durationTimeoutId = undefined;
  }

  createRecorder(stream: MediaStream) {
    this.recorder = new MediaRecorder(stream);

    this.recorder.ondataavailable = ({ data }) => {
      if (data.size > 0) this.chunks.push(data);
    };
    this.recorder.onstart = () => this.startCountDuration();
    this.recorder.onresume = () => this.startCountDuration();
    this.recorder.onpause = () => this.stopCountDuration();
    this.recorder.onstop = () => {
      this.duration += Date.now() - this.startDuration;
      this.stopCountDuration();
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
    console.log(this.recorder!.videoBitsPerSecond);
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

  async makeComposite({
    cameraEl,
    screenEl,
    cameraD,
  }: {
    cameraEl: HTMLVideoElement;
    screenEl: HTMLVideoElement;
    cameraD: { dx: number; dy: number; dw: number; dh: number };
  }) {
    // prepair canvas
    this.canvasCtx.save();
    this.canvasCtx.clearRect(0, 0, screenEl.videoWidth, screenEl.videoHeight);

    // draw screen onto canvas
    this.canvasCtx.scale(1, 1);
    this.canvasCtx.drawImage(screenEl, 0, 0, screenEl.videoWidth, screenEl.videoHeight);
    // draw camera onto canvas
    if (this.enableCamera) {
      // mirror camera
      this.canvasCtx.scale(-1, 1);
      this.canvasCtx.drawImage(cameraEl, cameraD.dx, cameraD.dy, cameraD.dw, cameraD.dh);
    }

    this.canvasCtx.restore();
    this.timeoutId = setTimeout(
      () => this.makeComposite({ cameraEl, screenEl, cameraD }),
      this.timeFrame
    );
  }

  async mergeStreams() {
    const cameraEl = this.cameraInstanceRef.current;
    const screenEl = this.screenInstanceRef.current;

    if (cameraEl && screenEl) {
      const { videoWidth, videoHeight } = screenEl;
      this.canvasEl.setAttribute("width", `${videoWidth}px`);
      this.canvasEl.setAttribute("height", `${videoHeight}px`);
      const { width: cameraWidth, height: cameraHeight } = cameraEl.getBoundingClientRect();
      const { width: screenWidth, height: screenHeight } = screenEl.getBoundingClientRect();
      const ratioWidthCanvas = videoWidth / screenWidth;
      const ratioHeightCanvas = videoHeight / screenHeight;

      const dx = -Math.floor(videoWidth - ratioWidthCanvas * cameraWidth - ratioWidthCanvas * 10);
      const dy = Math.floor(
        videoHeight - ratioHeightCanvas * cameraHeight - ratioHeightCanvas * 10
      );
      const dw = -ratioWidthCanvas * cameraWidth;
      const dh = ratioHeightCanvas * cameraHeight;

      await this.makeComposite({ cameraEl, screenEl, cameraD: { dx, dy, dw, dh } });

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

      this.cameraInstanceRef.current!.volume = 0;
      this.screenInstanceRef.current!.volume = 0;
      this.mergedInstanceRef.current!.volume = 0;
      this.mergedInstanceRef.current!.srcObject = new MediaStream(mergedStream);

      this.createRecorder(mergedStream);
    }
  }
}

export default RecorderManager;
