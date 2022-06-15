import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// redux actions
import { userExtraReducers as signoutExtraReducer } from "store/actions/user/signout";
import { authExtraReducers as confirmEmailCodeExtraReducers } from "store/actions/user/confirmEmailCode";
import { authExtraReducers as checkEmailExtraReducers } from "store/actions/user/checkEmail";
import { authExtraReducers as renewAccessTokenExtraReducers } from "store/actions/user/renewToken";
import { authExtraReducers as getUserInformationExtraReducers } from "store/actions/user/getUserInformation";

// redux slices
import { stateDefault } from "utils/constants";

// types
import { UserState, UserType } from "store/slices/_types";

const initialState: UserState = {
  accessToken: localStorage.getItem("accessToken") || "",
  refreshToken: localStorage.getItem("refreshToken") || "",
  isLoading: false,
  isAuth: false,
  user: stateDefault.USER,
  emailVerifying: "",
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType>) => {
      state.user = action.payload;
    },
    // this method will support for testing
    setEmailVerifying: (state, action: PayloadAction<string>) => {
      state.emailVerifying = action.payload;
    },
    setTokens: (state, action: PayloadAction<{ accessToken?: string; refreshToken?: string }>) => {
      const { accessToken, refreshToken } = action.payload;
      if (accessToken) state.accessToken = accessToken;
      if (refreshToken) state.refreshToken = refreshToken;
      state.isAuth = true;
    },
    setIsAuth: (state, action: PayloadAction<boolean>) => {
      state.isAuth = action.payload;
    },
  },
  extraReducers: (builder) => {
    signoutExtraReducer(builder);
    checkEmailExtraReducers(builder);
    confirmEmailCodeExtraReducers(builder);
    renewAccessTokenExtraReducers(builder);
    getUserInformationExtraReducers(builder);
  },
});

export const { setEmailVerifying, setIsAuth, setUser, setTokens } = userSlice.actions;

export default userSlice.reducer;
