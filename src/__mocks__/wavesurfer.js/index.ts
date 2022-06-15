const peaks = [0.15, -0.1, 0.8, 0.5];
const mockWaveSurfer = {
  setHeight: jest.fn(),
  on: jest.fn(),
  once: jest.fn(),
  load: jest.fn(),
  play: jest.fn(),
  pause: jest.fn(),
  stop: jest.fn(),
  destroy: jest.fn(),
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
  drawer: { drawPeaks: jest.fn(), clearWave: jest.fn(), drawBars: jest.fn() },
  backend: { splitPeaks: [peaks], getPeaks: jest.fn() },
};

module.exports = {
  __esModule: true,
  default: { create: (arg: any) => mockWaveSurfer },
};

export {};
