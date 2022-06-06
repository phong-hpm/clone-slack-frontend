import { createAsyncThunk } from "@reduxjs/toolkit";

// utils
import { SocketEvent } from "utils/constants";

// types
import { RootState } from "store/_types";

export const emitAddChannel = createAsyncThunk<{}, { name: string; desc: string }>(
  "socket/emitAddChannel",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const channelSocket = state.socket.channelSocket;
    channelSocket?.emit(SocketEvent.EMIT_ADD_CHANNEL, { data });
  }
);

export const emitAddUserToChannel = createAsyncThunk<{}, { id: string; userIds: string[] }>(
  "socket/emitAddUserToChannel",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const channelSocket = state.socket.channelSocket;
    channelSocket?.emit(SocketEvent.EMIT_ADD_USERS_TO_CHANNEL, { data });
  }
);

export const emitRemoveUserFromChannel = createAsyncThunk<{}, { id: string; userId: string }>(
  "socket/emitRemoveUserFromChannel",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const channelSocket = state.socket.channelSocket;
    channelSocket?.emit(SocketEvent.EMIT_REMOVE_USER_FROM_CHANNEL, { data });
  }
);
