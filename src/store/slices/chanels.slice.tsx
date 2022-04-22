import { createAction, createSlice, PayloadAction } from "@reduxjs/toolkit";

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
  selected: string;
}

const initialState: ChanelsState = {
  isLoading: false,
  list: [],
  directMessages: [],
  selected: "",
};

export const setSelectedChanel = createAction<string>("teams/setSelectedChanel");

export const chanelsSlice = createSlice({
  name: "chanels",
  initialState,
  reducers: {
    setChanelList: (state, action: PayloadAction<ChanelType[]>) => {
      state.list = action.payload;
    },
    setDirectMessagesList: (state, action: PayloadAction<ChanelType[]>) => {
      state.directMessages = action.payload;
    },
  },
});

export const { setChanelList, setDirectMessagesList } = chanelsSlice.actions;

export default chanelsSlice.reducer;
