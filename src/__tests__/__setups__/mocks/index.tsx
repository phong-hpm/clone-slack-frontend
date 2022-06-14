import "./intersectionObserver";
import "./resizeObserver";
import "./mediaStream";
import "./mediaRecorder";

jest.mock("react-router-dom");
jest.mock("emoji-mart");

URL.revokeObjectURL = jest.fn();
URL.createObjectURL = () => "blob:http://localhost:3000/url_id";

// remove warning from libaries
const ignoreList = ["componentWillReceiveProps", "componentWillUpdate", "isOptionEqualToValue"];
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

// can not import wavesurfer.js, so ignore this modal
jest.mock(
  "pages/ChatPage/Conversation/ChatBox/MessageInput/Record/RecordAudio/RecordAudioModal",
  () => () => <div>RecordAudioModal</div>
);

process.env.REACT_APP_SERVER_BASE_URL = "http://localhost:9999";
process.env.REACT_APP_SERVER_DOMAIN = "localhost:8000";

export {};
