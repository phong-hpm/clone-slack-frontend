const mockOn = jest.fn();
const mockEmit = jest.fn();
let connected = false;
const ioObject = {
  connected,
  on: mockOn,
  emit: mockEmit,
  connect: () => (connected = true),
  disconnect: () => {},
};

const io = () => ioObject;

module.exports = io;

export {};
