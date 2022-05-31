import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// redux actions
import { authExtraReducers as loginExtraReducers } from "store/actions/auth/login";
import { authExtraReducers as renewAccessTokenExtraReducers } from "store/actions/auth/renewToken";
import { authExtraReducers as getUserInformationExtraReducers } from "store/actions/auth/getUserInformation";

// redux slices
import { stateDefault } from "utils/constants";

// types
import { AuthState, UserType } from "store/slices/_types";

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  isLoading: false,
  isAuth: false,
  isVerified: false,
  user: stateDefault.USER,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setTokens: (state, action: PayloadAction<{ accessToken?: string; refreshToken?: string }>) => {
      const { accessToken, refreshToken } = action.payload;
      if (accessToken) state.accessToken = accessToken;
      if (refreshToken) state.refreshToken = refreshToken;
      state.isAuth = true;
      state.isVerified = true;
    },
    clearTokens: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.isAuth = false;
      state.isVerified = true;
    },
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
  },
  extraReducers: (builder) => {
    loginExtraReducers(builder);
    renewAccessTokenExtraReducers(builder);
    getUserInformationExtraReducers(builder);
  },
});

export const { setIsAuth, setUser, setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;
