import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// redux actions
import { authExtraReducers as loginExtraReducers } from "../actions/auth/login";
import { authExtraReducers as verifyExtraReducers } from "../actions/auth/verify";
import { authExtraReducers as renewAccessTokenExtraReducers } from "../actions/auth/renewToken";
import { authExtraReducers as getUserInformationExtraReducers } from "../actions/auth/getUserInformation";

// redux slices
import { UserType } from "./users.slice";
import { stateDefault } from "../../utils/constants";

export interface AuthState {
  accessToken: string;
  refreshToken: string;
  isAuth: boolean;
  isLoading: boolean;
  isVerified: boolean;
  user: UserType;
}
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
    setTokens: (state, action: PayloadAction<{ accessToken: string; refreshToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
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
    verifyExtraReducers(builder);
    renewAccessTokenExtraReducers(builder);
    getUserInformationExtraReducers(builder);
  },
});

export const { setIsAuth, setUser, setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;
