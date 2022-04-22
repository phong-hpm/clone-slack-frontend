import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MessageType {
  id: string;
  type: string;
  text: string;
  created: number;
  team: string;
  user: string;
}

export interface MessagesState {
  isLoading: boolean;
  list: MessageType[];
}

const initialState: MessagesState = {
  isLoading: false,
  list: [],
};

export const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    setMessagesList: (state, action: PayloadAction<MessageType[]>) => {
      state.list = action.payload;
    },
    addMessageList: (state, action: PayloadAction<MessageType>) => {
      state.list.push(action.payload);
    },
  },
});

export const { setMessagesList, addMessageList } = messagesSlice.actions;

export default messagesSlice.reducer;
