import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { UserType, TeamUsersState } from "store/slices/_types";

const initialState: TeamUsersState = {
  isLoading: false,
  list: [],
};

export const teamUsersSlice = createSlice({
  name: "teamUsers",
  initialState,
  reducers: {
    setTeamUserList: (state, action: PayloadAction<UserType[]>) => {
      state.list = action.payload;
    },
    updateTeamUserOnline: (state, action: PayloadAction<{ id: string; isOnline?: boolean }>) => {
      const { id, isOnline } = action.payload;

      const index = state.list.findIndex((usr) => usr.id === id);
      if (index > -1) state.list[index] = { ...state.list[index], isOnline };
    },
  },
});

export const { setTeamUserList, updateTeamUserOnline } = teamUsersSlice.actions;

export default teamUsersSlice.reducer;
