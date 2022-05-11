import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { Delta } from "quill";

export interface MessageFileType {
  id: string;
  url: string;
  created: number;
  fileType: "webm";
  size: number;
  type: "audio" | "video";
  wavePeaks: number[];
  mineType: "audio/webm";
  duration: number;
}

export interface MessageType {
  id: string;
  type: string;
  delta: Delta;
  created: number;
  team: string;
  user: string;
  isOwner?: boolean;
  isEdited?: boolean;
  isStared?: boolean;
  reactions: { id: string; users: string[]; count: number }[];
  files?: MessageFileType[];
}

export interface MessagesState {
  isLoading: boolean;
  list: MessageType[];
}

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
