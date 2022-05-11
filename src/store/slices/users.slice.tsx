import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { UserType, UsersState } from "./_types";

const initialState: UsersState = {
  isLoading: false,
  list: [],
  selected: "",
};

export const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUserList: (state, action: PayloadAction<UserType[]>) => {
      state.list = action.payload;
    },
    setSelectedUser: (state, action: PayloadAction<string>) => {
      state.selected = action.payload;
    },
    updateUserOnline: (state, action: PayloadAction<{ id: string; isOnline?: boolean }>) => {
      const { id, isOnline } = action.payload;

      const index = state.list.findIndex((usr) => usr.id === id);
      if (index > -1) state.list[index] = { ...state.list[index], isOnline };
    },
  },
});

export const { setUserList, setSelectedUser, updateUserOnline } = usersSlice.actions;

export default usersSlice.reducer;
