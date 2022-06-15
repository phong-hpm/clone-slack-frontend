class MediaRecorderMock {
  isTypeSupported = () => true;
  state = "inactive";
  onstart = jest.fn();
  onstop = jest.fn();
  onresume = jest.fn();
  onpause = jest.fn();
  onerror = jest.fn();
  ondataavailable = jest.fn();

  constructor(stream: MediaRecorder) {
    // assign [this] to stream, will help us can control this outside
    Object.assign(stream, this);
  }

  start = () => {
    this.state = "recording";
    this.ondataavailable({ data: new Blob(["1"]) });
    this.onstart();
  };
  stop = () => {
    this.state = "inactive";
    this.onstop();
  };
  pause = () => {
    this.state = "paused";
    this.onpause();
  };
  resume = () => {
    this.state = "recording";
    this.onresume();
  };
}

window.MediaRecorder = MediaRecorderMock as any;

export {};
