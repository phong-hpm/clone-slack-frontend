import { useContext } from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// contexts
import InputContext, {
  MessageInputProvider,
} from "pages/ChatPage/Conversation/ChatBox/MessageInput/InputContext";

// utils
import { customRender } from "__tests__/__setups__";
import InputDropZone from "pages/ChatPage/Conversation/ChatBox/MessageInput/InputDropZone";
import { act } from "react-dom/test-utils";

const ComponentSupport = (props?: { getInputFiles?: Function }) => {
  const { appState } = useContext(InputContext);

  return (
    <div>
      <div
        // when fire this Click, testcase can know what values [inputFiles] has
        data-testid="fire-getInputFiles"
        onClick={() => props?.getInputFiles?.(appState.inputFiles)}
      />
    </div>
  );
};

const renderComponent = (getInputFiles?: Function) => {
  return customRender(
    <MessageInputProvider configActions={{}}>
      <ComponentSupport getInputFiles={getInputFiles} />
      <div id="conversation-main">
        <InputDropZone />
      </div>
    </MessageInputProvider>
  );
};

describe("Test actions", () => {
  test("Test drag/drop onto conversation", async () => {
    const getInputFiles = jest.fn();
    renderComponent(getInputFiles);

    const conversationMain = document.getElementById("conversation-main")!;
    const dropzone = document.getElementsByClassName("dropzone")[0]!;

    expect(dropzone).toHaveStyle({ zIndex: -1 });
    fireEvent.dragOver(conversationMain);
    expect(dropzone).toHaveStyle({ zIndex: 1500 });
    fireEvent.dragLeave(conversationMain);
    expect(dropzone).toHaveStyle({ zIndex: -1 });
    fireEvent.drop(conversationMain);
    expect(dropzone).toHaveStyle({ zIndex: -1 });
  });

  test("Test drag/drop onto input dropzone", async () => {
    const getInputFiles = jest.fn();
    renderComponent(getInputFiles);

    const dropzone = document.getElementsByClassName("dropzone")[0]!;

    const file = new File(["image"], "image.png", { type: "image/png" });
    const inputDropzone = screen.getByTestId("dropzone");

    fireEvent.dragEnter(inputDropzone);
    await waitFor(() => expect(dropzone).toHaveStyle({ zIndex: 1500 }));

    fireEvent.dragLeave(inputDropzone);
    await waitFor(() => expect(dropzone).toHaveStyle({ zIndex: -1 }));

    await act(async () => waitFor(() => userEvent.upload(inputDropzone, [file])));
    userEvent.click(screen.getByTestId("fire-getInputFiles"));

    expect(getInputFiles).toBeCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          createdTime: expect.any(Number),
          mineType: "image/png",
          type: "image",
          url: "blob:http://localhost:3000/url_id",
        }),
      ])
    );
  });
});
