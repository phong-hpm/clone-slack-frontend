import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { UserType, ChannelUsersState } from "store/slices/_types";

const initialState: ChannelUsersState = {
  isLoading: false,
  list: [],
};

export const channelUsersSlice = createSlice({
  name: "channelUsers",
  initialState,
  reducers: {
    setChannelUserList: (state, action: PayloadAction<UserType[]>) => {
      state.list = action.payload;
    },
    updateChannelUserOnline: (state, action: PayloadAction<{ id: string; isOnline?: boolean }>) => {
      const { id, isOnline } = action.payload;

      const index = state.list.findIndex((usr) => usr.id === id);
      if (index > -1) state.list[index] = { ...state.list[index], isOnline };
    },
  },
});

export const { setChannelUserList, updateChannelUserOnline } = channelUsersSlice.actions;

export default channelUsersSlice.reducer;
