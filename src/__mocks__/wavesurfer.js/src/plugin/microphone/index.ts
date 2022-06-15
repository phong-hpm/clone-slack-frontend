const mockWaveSurfer = {
  setHeight: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  load: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  setPlaybackRate: jest.fn(),
  registerPlugins: jest.fn(),
  setWaveColor: jest.fn(),
  microphone: {
    active: true,
    on: jest.fn(),
    start: jest.fn(),
    stop: jest.fn(),
    stopDevice: jest.fn(),
    destroy: jest.fn(),
  },
};

module.exports = {
  __esModule: true,
  default: {
    create: (arg: any) => {
      return mockWaveSurfer;
    },
  },
};

export {};
