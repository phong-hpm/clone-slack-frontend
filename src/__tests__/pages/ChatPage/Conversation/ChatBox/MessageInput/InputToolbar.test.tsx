import { useContext } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// contexts
import InputContext, {
  MessageInputProvider,
} from "pages/ChatPage/Conversation/ChatBox/MessageInput/InputContext";

// components
import InputToolbar, {
  InputToolbarProps,
} from "pages/ChatPage/Conversation/ChatBox/MessageInput/InputToolbar";

const ComponentSupport = () => {
  const { appState, setFocus } = useContext(InputContext);

  return (
    <div>
      <div data-testid="isFocus" children={String(appState.isFocus)} />
      <div data-testid="fire-setFocus-false" onClick={() => setFocus(false)} />
    </div>
  );
};

const renderComponent = (props?: Partial<InputToolbarProps>) => {
  return render(
    <MessageInputProvider configActions={{}}>
      <ComponentSupport />
      <InputToolbar ref={() => {}} isFocus onClickLink={() => {}} {...props} />
    </MessageInputProvider>
  );
};
describe("Test actions", () => {
  test("Click tool icons", () => {
    const mockOnClickLink = jest.fn();
    renderComponent({ onClickLink: mockOnClickLink });

    const toolList = [
      "bold",
      "italic",
      "strike",
      "link",
      "list",
      "list",
      "blockquote",
      "code",
      "code-block",
    ];

    toolList.forEach((name) => {
      // update focus to false
      userEvent.click(screen.getByTestId("fire-setFocus-false"));
      // click tool icon
      userEvent.click(document.querySelector(`.ql-${name}`)!);
      expect(screen.getByTestId("isFocus")).toHaveTextContent("true");

      if (name === "link") {
        expect(mockOnClickLink).toBeCalledWith(expect.objectContaining({ type: "click" }));
      }
    });
  });
});
