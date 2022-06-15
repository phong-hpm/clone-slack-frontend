import { FC, useContext, useEffect } from "react";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// contexts
import InputContext, {
  MessageInputProvider,
} from "pages/ChatPage/Conversation/ChatBox/MessageInput/InputContext";

// components
import InputActions, {
  InputActionsProps,
} from "pages/ChatPage/Conversation/ChatBox/MessageInput/InputActions";

// types
import { EmojiModalProps } from "features/EmojiModal";
import { ContextAppStateType } from "pages/ChatPage/Conversation/ChatBox/MessageInput/_types";

jest.mock("components/SlackIcon", () => ({ icon }: { icon: string }) => (
  <div data-testid="SlackIcon">{icon}</div>
));
jest.mock(
  "pages/ChatPage/Conversation/ChatBox/MessageInput/Record/RecordAudio",
  () =>
    ({ onClose }: { onClose: () => void }) =>
      (
        <div data-testid="RecordAudio">
          <div data-testid="fire-onClose" onClick={() => onClose()} />
        </div>
      )
);
jest.mock(
  "pages/ChatPage/Conversation/ChatBox/MessageInput/Record/RecordVideo",
  () =>
    ({ onClose }: { onClose: () => void }) =>
      (
        <div data-testid="RecordVideo">
          <div data-testid="fire-onClose" onClick={() => onClose()} />
        </div>
      )
);
jest.mock("features/EmojiModal", () => (props: EmojiModalProps) => (
  <div data-testid="EmojiModal">
    <div
      data-testid="fire-onEmojiSelect"
      onClick={() => props.onEmojiSelect({ id: "white_check_mark", native: "✅" } as any)}
    />
    <div data-testid="fire-onClose" onClick={() => props.onClose()} />
  </div>
));

const ComponentSupport: FC<{ configActions?: ContextAppStateType["configActions"] }> = ({
  configActions,
}) => {
  const { appState, updateAppState, setFocus } = useContext(InputContext);

  useEffect(() => {
    updateAppState({
      configActions: {
        cancel: true,
        emoji: true,
        mention: true,
        more: true,
        recordAudio: true,
        recordVideo: true,
        schedule: true,
        send: true,
        ...configActions,
      },
    });
  }, [updateAppState, configActions]);

  return (
    <div>
      <div data-testid="isFocus" children={String(appState.isFocus)} />
      <div data-testid="fire-setFocus-false" onClick={() => setFocus(false)} />
    </div>
  );
};

const renderComponent = (
  props?: Partial<InputActionsProps>,
  configActions?: ContextAppStateType["configActions"]
) => {
  return render(
    <MessageInputProvider configActions={{}}>
      <ComponentSupport configActions={configActions} />
      <InputActions
        isShowToolbar
        isDisabledSend
        onSelectEmoji={() => {}}
        onClickAtSign={() => {}}
        onToggleToolbar={() => {}}
        onSend={() => {}}
        {...props}
      />
    </MessageInputProvider>
  );
};

describe("Test render", () => {
  test("When configActions hide more icon", () => {
    renderComponent({}, { more: false });

    expect(screen.queryByText("plus")).toBeNull();
  });

  test("When configActions hide recordVideo icon", () => {
    renderComponent({}, { recordVideo: false });

    expect(screen.queryByText("video")).toBeNull();
  });

  test("When configActions hide recordAudio icon", () => {
    renderComponent({}, { recordAudio: false });

    expect(screen.queryByText("microphone")).toBeNull();
  });

  test("When configActions hide emoji icon", () => {
    renderComponent({}, { emoji: false });

    expect(screen.queryByText("emoji")).toBeNull();
  });

  test("When configActions hide mentions icon", () => {
    renderComponent({}, { mention: false });

    expect(screen.queryByText("mentions")).toBeNull();
  });

  test("When configActions hide schedule button", () => {
    renderComponent({}, { schedule: false });

    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.queryByText("send-filled")).toBeNull();
    expect(screen.queryByText("chevron-down")).toBeNull();
  });

  test("When configActions hide send button", () => {
    renderComponent({}, { send: false });

    expect(screen.queryByText("Save")).toBeNull();
    expect(screen.queryByText("send-filled")).toBeNull();
    expect(screen.queryByText("chevron-down")).toBeNull();
  });
});

describe("Test actions", () => {
  test("Click microphone icon", () => {
    renderComponent();

    // Click microphone icon
    userEvent.click(screen.getByText("microphone"));
    expect(screen.getByTestId("RecordAudio")).toBeInTheDocument();

    // Close RecordAudio
    userEvent.click(within(screen.getByTestId("RecordAudio")).getByTestId("fire-onClose"));
    expect(screen.queryByTestId("RecordAudio")).toBeNull();
  });

  test("Click video icon", () => {
    renderComponent();

    // Click video icon
    userEvent.click(screen.getByText("video"));
    expect(screen.getByTestId("RecordVideo")).toBeInTheDocument();

    // Close RecordVideo
    userEvent.click(within(screen.getByTestId("RecordVideo")).getByTestId("fire-onClose"));
    expect(screen.queryByTestId("RecordVideo")).toBeNull();
  });

  test("Click emoji icon and select icon", () => {
    const mockOnSelectEmoji = jest.fn();
    renderComponent({ onSelectEmoji: mockOnSelectEmoji });

    // Click emoji icon
    userEvent.click(screen.getByText("emoji"));
    expect(screen.getByTestId("EmojiModal")).toBeInTheDocument();

    // Select emoji icon
    userEvent.click(within(screen.getByTestId("EmojiModal")).getByTestId("fire-onEmojiSelect"));
    expect(mockOnSelectEmoji).toBeCalledWith("✅");

    // Close EmojiModal
    userEvent.click(within(screen.getByTestId("EmojiModal")).getByTestId("fire-onClose"));
    expect(screen.queryByTestId("EmojiModal")).toBeNull();
  });

  test("Click formatting icon", () => {
    const mockOnToggleToolbar = jest.fn();
    renderComponent({ onToggleToolbar: mockOnToggleToolbar });

    // Click formatting icon
    userEvent.click(screen.getByText("formatting"));
    expect(mockOnToggleToolbar).toBeCalledWith(false);
  });

  test("Click mentions icon", () => {
    const mockOnClickAtSign = jest.fn();
    renderComponent({ onClickAtSign: mockOnClickAtSign });

    // Click mentions icon
    userEvent.click(screen.getByText("mentions"));
    expect(mockOnClickAtSign).toBeCalledWith(expect.objectContaining({ type: "click" }));
  });

  test("Click schedule and send group icons", async () => {
    const mockOnSend = jest.fn();
    renderComponent({ isDisabledSend: false, onSend: mockOnSend }, { schedule: true });

    // Click send icon
    userEvent.click(screen.getByText("send-filled"));
    expect(mockOnSend).toBeCalledWith(expect.objectContaining({ type: "click" }));

    // Click schedule icon
    userEvent.click(screen.getByText("chevron-down"));
    expect(screen.getByText("Schedule message")).toBeInTheDocument();
    // Press esc to close menu
    userEvent.keyboard("{esc}");
    await waitFor(() => expect(screen.queryByText("Schedule message")).toBeNull());
  });

  test("Click Save", async () => {
    const mockOnSend = jest.fn();
    renderComponent({ isDisabledSend: false, onSend: mockOnSend }, { schedule: false });

    // Click send icon
    userEvent.click(screen.getByText("Save"));
    expect(mockOnSend).toBeCalledWith(expect.objectContaining({ type: "click" }));
  });
});
