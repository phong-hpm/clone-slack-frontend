import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Socket } from "socket.io-client";

// types
import { SocketState } from "store/slices/_types";

const initialState: SocketState = {
  channelSocket: undefined,
  messageSocket: undefined,
};

export const socketSlice = createSlice({
  name: "socket",
  initialState,
  reducers: {
    setChannelSocket: (state, action: PayloadAction<Socket>) => {
      state.channelSocket = action.payload as any;
    },
    setMessageSocket: (state, action: PayloadAction<Socket>) => {
      state.messageSocket = action.payload as any;
    },
  },
});

export const { setChannelSocket, setMessageSocket } = socketSlice.actions;

export default socketSlice.reducer;
