const mockConnect = jest.fn();
const mockOn = jest.fn();
const mockEmit = jest.fn();

module.exports = () => ({
  connected: true,
  on: mockOn,
  emit: mockEmit,
  disconnect: () => {},
});

export {};
