import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { extraReducers as loginExtraReducers } from "../actions/auth/login";
import { extraReducers as verifyExtraReducers } from "../actions/auth/verify";

export interface User {
  name: string;
  email: string;
}

export interface AuthState {
  isAuth: boolean;
  isLoading: boolean;
  isVerified: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
}

const initialState: AuthState = {
  isAuth: false,
  isLoading: false,
  isVerified: false,
  accessToken: "",
  refreshToken: "",
  user: {
    email: "",
    name: "",
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      const { user, isAuth, accessToken, refreshToken } = action.payload;
      state.isAuth = isAuth;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
    },
  },
  extraReducers: (builder) => {
    loginExtraReducers(builder);
    verifyExtraReducers(builder);
  },
});

// Action creators are generated for each case reducer function
export const { setAuth } = authSlice.actions;

export default authSlice.reducer;
