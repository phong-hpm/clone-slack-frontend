import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { DayMessageType, MessagesState, MessageType } from "store/slices/_types";

const initialState: MessagesState = {
  isLoading: true,
  hasMore: true,
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
      if (index > -1) state.dayMessageList[index].message = newMessage;
    },
    removeMessage: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.list = state.list.filter((mes) => mes.id !== id);
    },
    setMessagesList: (
      state,
      action: PayloadAction<{ hasMore: boolean; messages: MessageType[] }>
    ) => {
      const { messages } = action.payload;
      state.list = messages;
    },
    pushMoreMessagesList: (
      state,
      action: PayloadAction<{ hasMore: boolean; messages: MessageType[] }>
    ) => {
      const { messages } = action.payload;
      state.list = [...messages, ...state.list];
    },
    setDayMessageList: (
      state,
      action: PayloadAction<{ hasMore?: boolean; dayMessages: DayMessageType[] }>
    ) => {
      const { hasMore, dayMessages } = action.payload;
      state.dayMessageList = dayMessages;
      // when [hasMore] is undefined, that mean [setDayMessageList] was dispatched after
      //   new message was added or removed
      //   we will not update [hasMore] state
      if (hasMore !== undefined) state.hasMore = hasMore;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setMessagesList,
  pushMoreMessagesList,
  setDayMessageList,
  addMessage,
  updateMessage,
  removeMessage,
} = messagesSlice.actions;

export default messagesSlice.reducer;
