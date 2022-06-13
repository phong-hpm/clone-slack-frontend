class MediaRecorderMock {
  isTypeSupported = () => true;
  state = "inactive";
  onstart = jest.fn();
  onstop = jest.fn();
  onresume = jest.fn();
  onpause = jest.fn();
  ondataavailable = jest.fn();
  start = () => {
    this.state = "recording";
    this.ondataavailable({ data: new Blob(["1"]) });
    // don't invoke [onstart] because we are using it for set [countdown] in [setTimeout]
    // besides, we are using [jest.useFakeTimer] and [jest.runAllTimers]
    // so if we fire this one, component will be rerendered infinity
    // this.onstart();
  };
  onerror = jest.fn();
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
    // same with [onstart]
    // this.onresume();
  };
}

window.MediaRecorder = MediaRecorderMock as any;

export {};
