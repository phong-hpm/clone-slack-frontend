import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { ChannelsState, ChannelType } from "store/slices/_types";

const initialState: ChannelsState = {
  isLoading: false,
  list: [],
  selectedId: "",
};

export const channelsSlice = createSlice({
  name: "channels",
  initialState,
  reducers: {
    addChannel: (state, action: PayloadAction<ChannelType>) => {
      state.list.push(action.payload);
    },
    updateChannel: (
      state,
      action: PayloadAction<{ id: string; channel: Partial<ChannelType> }>
    ) => {
      const { id, channel: updatedChannel } = action.payload;
      let channels = state.list;
      let index = channels.findIndex((channel) => channel.id === id);
      if (index > -1) channels[index] = { ...channels[index], ...updatedChannel };
    },
    removeChannel: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      state.list = state.list.filter((channel) => channel.id !== id);
      state.selectedId = state.list[0].id;
    },
    updateChannelParterOnline: (state, action: PayloadAction<{ id: string; online: boolean }>) => {
      const { id, online } = action.payload;

      const index = state.list.findIndex((channel) => channel.partner?.id === id);

      if (index > -1 && state.list[index].partner) {
        state.list[index].partner!.isOnline = online;
      }
    },
    setChannelsList: (state, action: PayloadAction<ChannelType[]>) => {
      state.list = action.payload;
    },
    setSelectedChannelId: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
  },
});

export const {
  setSelectedChannelId,
  setChannelsList,
  addChannel,
  updateChannel,
  removeChannel,
  updateChannelParterOnline,
} = channelsSlice.actions;

export default channelsSlice.reducer;
