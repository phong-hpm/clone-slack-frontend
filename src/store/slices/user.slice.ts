import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// redux actions
import { authExtraReducers as confirmEmailCodeExtraReducers } from "store/actions/user/confirmEmailCode";
import { authExtraReducers as checkEmailExtraReducers } from "store/actions/user/checkEmail";
import { authExtraReducers as renewAccessTokenExtraReducers } from "store/actions/user/renewToken";
import { authExtraReducers as getUserInformationExtraReducers } from "store/actions/user/getUserInformation";

// redux slices
import { stateDefault } from "utils/constants";

// types
import { AuthState, UserType } from "store/slices/_types";

const initialState: AuthState = {
  accessToken: localStorage.getItem("accessToken") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  isLoading: false,
  isAuth: false,
  user: stateDefault.USER,
  emailVerifying: "",
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    setEmailVerifying: (state, action: PayloadAction<{ email: string }>) => {
      const { email } = action.payload;
      state.emailVerifying = email;
    },
    setTokens: (state, action: PayloadAction<{ accessToken?: string; refreshToken?: string }>) => {
      const { accessToken, refreshToken } = action.payload;
      if (accessToken) state.accessToken = accessToken;
      if (refreshToken) state.refreshToken = refreshToken;
      state.isAuth = true;
    },
    clearTokens: (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.isAuth = false;
    },
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
  },
  extraReducers: (builder) => {
    checkEmailExtraReducers(builder);
    confirmEmailCodeExtraReducers(builder);
    renewAccessTokenExtraReducers(builder);
    getUserInformationExtraReducers(builder);
  },
});

export const { setEmailVerifying, setIsAuth, setUser, setTokens, clearTokens } = authSlice.actions;

export default authSlice.reducer;
