import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ChannelType {
  id: string;
  name: string;
  type: "direct_message" | "channel";
  isAllUser: boolean;
  users: string[];
  creater: string;
  latest: number;
  created: number;
}

export interface ChannelsState {
  isLoading: boolean;
  list: ChannelType[];
  directMessages: ChannelType[];
  selectedId: string;
}

const initialState: ChannelsState = {
  isLoading: false,
  list: [],
  directMessages: [],
  selectedId: "",
};

export const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    setChannelsList: (state, action: PayloadAction<ChannelType[]>) => {
      state.list = action.payload;
    },
    addChannelList: (state, action: PayloadAction<ChannelType>) => {
      state.list.push(action.payload);
    },
    setDirectMessagesList: (state, action: PayloadAction<ChannelType[]>) => {
      state.directMessages = action.payload;
    },
    setSelectedChannelId: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
  },
});

export const { setSelectedChannelId, setChannelsList, addChannelList, setDirectMessagesList } =
  channelsSlice.actions;

export default channelsSlice.reducer;
