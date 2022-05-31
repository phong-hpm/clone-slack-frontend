import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { ChannelsState, ChannelType } from "store/slices/_types";

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
    addChannel: (state, action: PayloadAction<ChannelType>) => {
      const channel = action.payload;
      if (channel.type === "channel") state.list.push(action.payload);
      else state.directMessages.push(action.payload);
    },
    updateChannel: (
      state,
      action: PayloadAction<{ id: string; channel: Partial<ChannelType> }>
    ) => {
      const { id, channel: updatedChannel } = action.payload;
      let channels = state.list;
      let index = channels.findIndex((channel) => channel.id === id);

      if (index === -1) {
        channels = state.directMessages;
        index = channels.findIndex((channel) => channel.id === id);
      }
      if (index === -1) return;

      channels[index] = { ...channels[index], ...updatedChannel };
    },
    updateChannelParterOnline: (state, action: PayloadAction<{ id: string; online: boolean }>) => {
      const { id, online } = action.payload;

      const index = state.directMessages.findIndex((channel) => channel.partner?.id === id);

      if (index > -1 && state.directMessages[index].partner) {
        const partner = state.directMessages[index].partner!;
        partner.isOnline = online;
      }
    },
    setChannelsList: (state, action: PayloadAction<ChannelType[]>) => {
      state.list = action.payload;
    },
    setDirectMessagesList: (state, action: PayloadAction<ChannelType[]>) => {
      state.directMessages = action.payload;
    },
    setSelectedChannelId: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
    resetState: (state) => {
      state.list = [];
      state.directMessages = [];
    },
  },
});

export const {
  setSelectedChannelId,
  setChannelsList,
  addChannel,
  updateChannel,
  updateChannelParterOnline,
  setDirectMessagesList,
  resetState,
} = channelsSlice.actions;

export default channelsSlice.reducer;
