import { createAsyncThunk } from "@reduxjs/toolkit";

// utils
import { SocketEvent } from "utils/constants";

// types
import { Delta } from "quill";
import { RootState } from "store/_types";

export const emitLoadMoreMessages = createAsyncThunk<{}, { limit?: number }>(
  "socket/emitLoadMoreMessages",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const messageSocket = state.socket.messageSocket;
    messageSocket?.emit(SocketEvent.EMIT_LOAD_MORE_MESSAGES, { data });
  }
);

export const emitAddMessage = createAsyncThunk<{}, { delta: Delta }>(
  "socket/emitAddMessage",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const messageSocket = state.socket.messageSocket;
    messageSocket?.emit(SocketEvent.EMIT_ADD_MESSAGE, { data });
  }
);

export const emitShareMessageToChannel = createAsyncThunk<
  {},
  { toChannelId: string; delta: Delta; sharedMessageId: string }
>("socket/emitShareMessageToChannel", async (data, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const messageSocket = state.socket.messageSocket;
  messageSocket?.emit(SocketEvent.EMIT_SHARE_MESSAGE_TO_CHANNEL, { data });
});

export const emitShareMessageToGroupUsers = createAsyncThunk<
  {},
  { toUserIds: string[]; delta: Delta; sharedMessageId: string }
>("socket/emitShareMessageToGroupUsers", async (data, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const messageSocket = state.socket.messageSocket;
  messageSocket?.emit(SocketEvent.EMIT_SHARE_MESSAGE_TO_GROUP_USERS, { data });
});

export const emitEditMessage = createAsyncThunk<{}, { id: string; delta: Delta }>(
  "socket/emitEditMessage",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const messageSocket = state.socket.messageSocket;
    messageSocket?.emit(SocketEvent.EMIT_EDIT_MESSAGE, { data });
  }
);

export const emitRemoveMessage = createAsyncThunk<{}, { id: string }>(
  "socket/emitRemoveMessage",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const messageSocket = state.socket.messageSocket;
    messageSocket?.emit(SocketEvent.EMIT_REMOVE_MESSAGE, { data });
  }
);

export const emitStarredMessage = createAsyncThunk<{}, { id: string }>(
  "socket/emitStarredMessage",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const messageSocket = state.socket.messageSocket;
    messageSocket?.emit(SocketEvent.EMIT_STARRED_MESSAGE, { data });
  }
);

export const emitReactionMessage = createAsyncThunk<{}, { id: string; reactionId: string }>(
  "socket/emitReactionMessage",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const messageSocket = state.socket.messageSocket;
    messageSocket?.emit(SocketEvent.EMIT_REACTION_MESSAGE, { data });
  }
);

export const emitRemoveMessageFile = createAsyncThunk<{}, { id: string; fileId: string }>(
  "socket/emitRemoveMessageFile",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const messageSocket = state.socket.messageSocket;
    messageSocket?.emit(SocketEvent.EMIT_REMOVE_MESSAGE_FILE, { data });
  }
);
