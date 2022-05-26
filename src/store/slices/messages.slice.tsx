import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { DayMessageType, MessagesState, MessageType } from "store/slices/_types";

const initialState: MessagesState = {
  isLoading: true,
  list: [],
  dayMessageList: [],
};

export const cachedList: any = {};

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
      const newMessage = action.payload;
      let index = state.list.findIndex((mes) => mes.id === newMessage.id);
      state.list[index] = newMessage;

      index = state.dayMessageList.findIndex(({ message }) => message?.id === newMessage.id);
      state.dayMessageList[index].message = newMessage;
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.list = state.list.filter((mes) => mes.id !== id);
    },
    setMessagesList: (state, action: PayloadAction<MessageType[]>) => {
      const messages = action.payload;
      state.list = messages;
    },
    setDayMessageList: (state, action: PayloadAction<DayMessageType[]>) => {
      const messages = action.payload;
      state.dayMessageList = messages;
      state.isLoading = false;
    },
    resetMessageState: (state) => {
      state.list = [];
      state.isLoading = true;
    },
  },
});

export const {
  setLoading,
  setMessagesList,
  setDayMessageList,
  addMessage,
  updateMessage,
  removeMessage,
  resetMessageState,
} = messagesSlice.actions;

export default messagesSlice.reducer;
