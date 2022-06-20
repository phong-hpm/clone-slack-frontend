import "./intersectionObserver";
import "./resizeObserver";
import "./mediaStream";
import "./mediaRecorder";

jest.mock("react-router-dom");
jest.mock("emoji-mart");

URL.revokeObjectURL = jest.fn();
URL.createObjectURL = () => "blob:http://localhost:3000/url_id";

// remove warning from libaries
const ignoreList = [
  "componentWillReceiveProps",
  "componentWillUpdate",
  "isOptionEqualToValue",
  "which is more than the warning threshold",
];
const originalWarn = console.warn.bind(console.warn);
console.warn = (msg, ...args) => {
  for (const ignore of ignoreList) {
    if (msg.toString().includes(ignore)) return false;
  }
  return originalWarn(msg, ...args);
};

// Error: "Cannot flush updates when React is already rendering"
Object.defineProperty(HTMLMediaElement.prototype, "muted", { set: jest.fn() });
HTMLCanvasElement.prototype.getContext = (() => {}) as any;
window.HTMLMediaElement.prototype.play = () => Promise.resolve();

// range(...).getBoundingClientRect is not a function
document.createRange = () => {
  const range = new Range();
  range.getBoundingClientRect = jest.fn();
  range.getClientRects = jest.fn(() => ({ item: () => null, length: 0 })) as any;
  return range;
};

process.env.REACT_APP_SERVER_BASE_URL = "http://localhost:9999";
process.env.REACT_APP_SOCKET_BASE_URL = "ws://localhost:8000";

export {};
