import mockIO from "socket.io-client";

// store
import { setupStore } from "store";

// redux actions
import {
  emitAddMessage,
  emitEditMessage,
  emitLoadMoreMessages,
  emitReactionMessage,
  emitRemoveMessage,
  emitRemoveMessageFile,
  emitShareMessageToChannel,
  emitShareMessageToGroupUsers,
  emitStarredMessage,
} from "store/actions/socket/messageSocket.action";

// redux slices
import { setMessageSocket } from "store/slices/socket.slice";

// utils
import { SocketEvent } from "utils/constants";

// types
import { Delta } from "quill";

const messageSocket = mockIO();
let store = setupStore();

beforeEach(() => {
  store = setupStore();
  store.dispatch(setMessageSocket(messageSocket));
});

describe("Test message socket actions", () => {
  test("Test emitAddMessage", () => {
    const data = { delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta };
    store.dispatch(emitAddMessage(data));

    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_ADD_MESSAGE, { data });
  });

  test("Test emitEditMessage", () => {
    const data = { id: "id", delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta };
    store.dispatch(emitEditMessage(data));

    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_EDIT_MESSAGE, { data });
  });

  test("Test emitLoadMoreMessages", () => {
    const data = { limit: 15 };
    store.dispatch(emitLoadMoreMessages(data));

    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_LOAD_MORE_MESSAGES, { data });
  });

  test("Test emitReactionMessage", () => {
    const data = { id: "id", reactionId: "reactionId" };
    store.dispatch(emitReactionMessage(data));

    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_REACTION_MESSAGE, { data });
  });

  test("Test emitRemoveMessage", () => {
    const data = { id: "id" };
    store.dispatch(emitRemoveMessage(data));

    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_REMOVE_MESSAGE, {
      data,
    });
  });

  test("Test emitRemoveMessageFile", () => {
    const data = { id: "id", fileId: "fileId" };
    store.dispatch(emitRemoveMessageFile(data));

    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_REMOVE_MESSAGE_FILE, {
      data,
    });
  });

  test("Test emitShareMessageToChannel", () => {
    const data = {
      toChannelId: "toChannelId",
      delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
      sharedMessageId: "sharedMessageId",
    };
    store.dispatch(emitShareMessageToChannel(data));

    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_SHARE_MESSAGE_TO_CHANNEL, {
      data,
    });
  });

  test("Test emitShareMessageToGroupUsers", () => {
    const data = {
      toUserIds: ["toUserIds"],
      delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
      sharedMessageId: "sharedMessageId",
    };
    store.dispatch(emitShareMessageToGroupUsers(data));

    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_SHARE_MESSAGE_TO_GROUP_USERS, {
      data,
    });
  });

  test("Test emitStarredMessage", () => {
    const data = { id: "id" };
    store.dispatch(emitStarredMessage(data));

    expect(messageSocket.emit).toBeCalledWith(SocketEvent.EMIT_STARRED_MESSAGE, {
      data,
    });
  });
});
