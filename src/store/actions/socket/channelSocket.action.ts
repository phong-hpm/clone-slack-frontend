import { createAsyncThunk } from "@reduxjs/toolkit";

// utils
import { SocketEvent } from "utils/constants";

// types
import { RootState } from "store/_types";
import { ChannelType } from "store/slices/_types";

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

export const emitUserLeaveChannel = createAsyncThunk<{}, { id: string }>(
  "socket/emitUserLeaveChannel",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const channelSocket = state.socket.channelSocket;
    channelSocket?.emit(SocketEvent.EMIT_USER_LEAVE_CHANNEL, { data });
  }
);

export const emitEditChannelName = createAsyncThunk<{}, { id: string; name: string }>(
  "socket/emitEditChannelName",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const channelSocket = state.socket.channelSocket;
    channelSocket?.emit(SocketEvent.EMIT_EDIT_CHANNEL_NAME, { data });
  }
);

export const emitEditChannelOptionalFields = createAsyncThunk<
  {},
  { id: string } & Partial<Pick<ChannelType, "isStarred" | "topic" | "desc" | "notification">>
>("socket/emitEditChannelOptionalFields", async (data, thunkAPI) => {
  const state = thunkAPI.getState() as RootState;
  const channelSocket = state.socket.channelSocket;
  channelSocket?.emit(SocketEvent.EMIT_EDIT_CHANNEL_OPTIONAL_FIELDS, { data });
});

export const emitChangeToPrivatechannel = createAsyncThunk<{}, { id: string; name: string }>(
  "socket/emitChangeToPrivatechannel",
  async (data, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const channelSocket = state.socket.channelSocket;
    channelSocket?.emit(SocketEvent.EMIT_CHANGE_TO_PRIVATE_CHANNEL, { data });
  }
);
