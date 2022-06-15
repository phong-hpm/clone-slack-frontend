import mockIO from "socket.io-client";

// store
import { setupStore } from "store";

// redux actions
import {
  emitAddChannel,
  emitAddUserToChannel,
  emitChangeToPrivatechannel,
  emitEditChannelMute,
  emitEditChannelName,
  emitEditChannelOptionalFields,
  emitUserLeaveChannel,
} from "store/actions/socket/channelSocket.action";

// redux slices
import { setChannelSocket } from "store/slices/socket.slice";

// utils
import { SocketEvent } from "utils/constants";

const channelSocket = mockIO();
let store = setupStore();

beforeEach(() => {
  store = setupStore();
  store.dispatch(setChannelSocket(channelSocket));
});

describe("Test channel socket actions", () => {
  test("Test emitAddChannel", () => {
    const data = { name: "name", desc: "desc" };
    store.dispatch(emitAddChannel(data));

    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_ADD_CHANNEL, { data });
  });

  test("Test emitAddUserToChannel", () => {
    const data = { id: "id", userIds: ["user_1", "user_2"] };
    store.dispatch(emitAddUserToChannel(data));

    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_ADD_USERS_TO_CHANNEL, { data });
  });

  test("Test emitUserLeaveChannel", () => {
    const data = { id: "id" };
    store.dispatch(emitUserLeaveChannel(data));

    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_USER_LEAVE_CHANNEL, { data });
  });

  test("Test emitEditChannelName", () => {
    const data = { id: "id", name: "name" };
    store.dispatch(emitEditChannelName(data));

    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_EDIT_CHANNEL_NAME, { data });
  });

  test("Test emitEditChannelMute", () => {
    const data = { id: "id", isMuted: true };
    store.dispatch(emitEditChannelMute(data));

    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_EDIT_CHANNEL_OPTIONAL_FIELDS, {
      data,
    });
  });

  test("Test emitEditChannelOptionalFields", () => {
    const data = {
      id: "id",
      isStarred: true,
      topic: "topic",
      desc: "desc",
      notification: "all" as any,
    };
    store.dispatch(emitEditChannelOptionalFields(data));

    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_EDIT_CHANNEL_OPTIONAL_FIELDS, {
      data,
    });
  });

  test("Test emitChangeToPrivatechannel", () => {
    const data = { id: "id", name: "name" };
    store.dispatch(emitChangeToPrivatechannel(data));

    expect(channelSocket.emit).toBeCalledWith(SocketEvent.EMIT_CHANGE_TO_PRIVATE_CHANNEL, {
      data,
    });
  });
});
