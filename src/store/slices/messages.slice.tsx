import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { MessagesState, MessageType } from "./_types";

const initialState: MessagesState = {
  isLoading: true,
  list: [],
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    addMessage: (state, action: PayloadAction<MessageType>) => {
      state.list.push(action.payload);
    },
    updateMessage: (state, action: PayloadAction<MessageType>) => {
      const message = action.payload;
      const index = state.list.findIndex((mes) => mes.id === message.id);
      state.list[index] = message;
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.list = state.list.filter((mes) => mes.id !== id);
    },
    setMessagesList: (state, action: PayloadAction<MessageType[]>) => {
      state.list = action.payload;
    },
  },
});

export const { setLoading, setMessagesList, addMessage, updateMessage, removeMessage } =
  messagesSlice.actions;

export default messagesSlice.reducer;
