import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserType {
  id: string;
  name: string;
  email: string;
  timeZone: string;
}

export interface UsersState {
  isLoading: boolean;
  list: UserType[];
  selected: string;
}

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
  },
});

export const { setUserList, setSelectedUser } = usersSlice.actions;

export default usersSlice.reducer;
