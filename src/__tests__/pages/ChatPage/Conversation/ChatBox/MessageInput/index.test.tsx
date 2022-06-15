import { screen } from "@testing-library/react";
import mockIO from "socket.io-client";

// redux action
import * as uploadFile from "store/actions/message/uploadFiles";

// components
import MessageInput from "pages/ChatPage/Conversation/ChatBox/MessageInput";
import { InputMainProps } from "pages/ChatPage/Conversation/ChatBox/MessageInput/InputMain";
import { setChannelsList, setSelectedChannelId } from "store/slices/channels.slice";
import { ChannelType, MessageFileType } from "store/slices/_types";

// utils
import { customRender, store } from "__tests__/__setups__";

// types
import { Delta } from "quill";
import userEvent from "@testing-library/user-event";
import { setMessageSocket } from "store/slices/socket.slice";
import { SocketEvent } from "utils/constants";

jest.mock(
  "pages/ChatPage/Conversation/ChatBox/MessageInput/InputMain",
  () => (props: InputMainProps) =>
    (
      <div data-testid="InputMain">
        <div data-testid="placeholder" children={props.placeHolder} />
        <div
          data-testid="fire-onSend"
          onClick={() => props.onSend?.({ ops: [{ insert: "hello\n" }] } as unknown as Delta, [])}
        />
        <div
          data-testid="fire-onSend-files"
          onClick={() =>
            props.onSend?.({ ops: [{ insert: "hello\n" }] } as unknown as Delta, [
              { id: "fileId" } as unknown as MessageFileType,
            ])
          }
        />
      </div>
    )
);

const messageSocket = mockIO();

const publicChannel: ChannelType = {
  id: "C-111111",
  type: "public_channel",
  name: "general",
  users: [],
  creator: "U-123456",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  unreadMessageCount: 79,
};

const directMessage: ChannelType = {
  id: "D-111111",
  type: "direct_message",
  name: "Phong Ho",
  users: [],
  creator: "U-123456",
  createdTime: 1650353609205,
  updatedTime: 1654589660640,
  unreadMessageCount: 79,
};

beforeEach(() => {
  store.dispatch(setMessageSocket(messageSocket));
  store.dispatch(setChannelsList([publicChannel, directMessage]));
  store.dispatch(setSelectedChannelId(publicChannel.id));
});

describe("Test render", () => {
  test("When no channel was selected", () => {
    store.dispatch(setSelectedChannelId(""));

    customRender(<MessageInput configActions={{}} />);
    expect(screen.getByTestId("placeholder")).toHaveTextContent("");
  });

  test("When a public channel was selected", () => {
    store.dispatch(setSelectedChannelId(publicChannel.id));

    customRender(<MessageInput configActions={{}} />);
    expect(screen.getByTestId("placeholder")).toHaveTextContent(
      `Send a message to #${publicChannel.name}`
    );
  });

  test("When a public channel was selected", () => {
    store.dispatch(setSelectedChannelId(directMessage.id));

    customRender(<MessageInput configActions={{}} />);
    expect(screen.getByTestId("placeholder")).toHaveTextContent(
      `Send a message to ${directMessage.name}`
    );
  });
});

describe("Test actions", () => {
  test("Click send when autoSend", () => {
    customRender(<MessageInput isAutoSend configActions={{}} />);

    userEvent.click(screen.getByTestId("fire-onSend"));
    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_ADD_MESSAGE, {
      data: { delta: { ops: [{ insert: "hello\n" }] } },
    });
  });

  test("Click send when has files", () => {
    const mockUploadFiles = jest.spyOn(uploadFile, "uploadFiles");
    customRender(<MessageInput isAutoSend configActions={{}} />);

    userEvent.click(screen.getByTestId("fire-onSend-files"));
    expect(messageSocket.emit).not.toBeCalled();
    expect(mockUploadFiles).toBeCalledWith({
      delta: { ops: [{ insert: "hello\n" }] },
      files: [{ id: "fileId" }],
    });
  });

  test("Click send when controlled", () => {
    const mockOnSend = jest.fn();
    customRender(<MessageInput isAutoSend onSend={mockOnSend} configActions={{}} />);

    userEvent.click(screen.getByTestId("fire-onSend"));
    expect(mockOnSend).toBeCalledWith({ ops: [{ insert: "hello\n" }] }, []);
    expect(messageSocket.emit).not.toBeCalled();
  });

  test("Click send when not autoSend", () => {
    customRender(<MessageInput isAutoSend={false} configActions={{}} />);

    userEvent.click(screen.getByTestId("fire-onSend"));
    expect(messageSocket.emit).not.toBeCalled();
  });
});
