import "./intersectionObserver";

jest.mock("react-router-dom");
jest.mock("emoji-mart");

// Error: "Cannot flush updates when React is already rendering"
Object.defineProperty(HTMLMediaElement.prototype, "muted", { set: jest.fn() });

// can not import wavesurfer.js, so ignore this modal
jest.mock(
  "pages/ChatPage/Conversation/ChatBox/MessageInput/Record/RecordAudio/RecordAudioModal",
  () => () => <div>RecordAudioModal</div>
);

export {};
