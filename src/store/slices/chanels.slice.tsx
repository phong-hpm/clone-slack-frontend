import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChanelType {
  id: string;
  name: string;
  type: string;
  isAllUser: boolean;
  users: string[];
  creater: string;
  latest: number;
  created: number;
}

export interface ChanelsState {
  isLoading: boolean;
  list: ChanelType[];
  directMessages: ChanelType[];
  selectedId: string;
}

const initialState: ChanelsState = {
  isLoading: false,
  list: [],
  directMessages: [],
  selectedId: "",
};

export const chanelsSlice = createSlice({
  name: "chanels",
  initialState,
  reducers: {
    setChanelsList: (state, action: PayloadAction<ChanelType[]>) => {
      state.list = action.payload;
    },
    addChanelList: (state, action: PayloadAction<ChanelType>) => {
      state.list.push(action.payload);
    },
    setDirectMessagesList: (state, action: PayloadAction<ChanelType[]>) => {
      state.directMessages = action.payload;
    },
    setSelectedChanelId: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
  },
});

export const { setSelectedChanelId, setChanelsList, addChanelList, setDirectMessagesList } =
  chanelsSlice.actions;

export default chanelsSlice.reducer;
