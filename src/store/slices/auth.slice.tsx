import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { authExtraReducers as loginExtraReducers } from "../actions/auth/login";
import { authExtraReducers as verifyExtraReducers } from "../actions/auth/verify";
import { UserType } from "./users.slice";

export interface AuthState {
  isAuth: boolean;
  isLoading: boolean;
  isVerified: boolean;
  user: UserType;
}

const initialState: AuthState = {
  isLoading: false,
  isAuth: false,
  isVerified: false,
  user: {
    id: "",
    email: "",
    name: "",
    timeZone: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    loginExtraReducers(builder);
    verifyExtraReducers(builder);
  },
});

export const { setUser } = authSlice.actions;

export default authSlice.reducer;
