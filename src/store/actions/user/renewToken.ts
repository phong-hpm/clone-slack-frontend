import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";

// utils
import axios from "utils/axios";

// types
import { RootState } from "store/_types";
import { UserState } from "store/slices/_types";
import { RenewAccessTokenResponseData } from "store/actions/user/_types";
import { AxiosResponseCustom } from "store/actions/_types";

export const renewAccessToken = createAsyncThunk<AxiosResponseCustom<RenewAccessTokenResponseData>>(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const postData = { refreshToken: state.user.refreshToken };
    const response = await axios.post("auth/refresh-token", { postData });
    return response;
  }
);

export const authExtraReducers = (builder: ActionReducerMapBuilder<UserState>) => {
  builder
    .addCase(renewAccessToken.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(renewAccessToken.fulfilled, (state, action) => {
      const { ok = false, accessToken } = action.payload.data;

      if (ok) {
        localStorage.setItem("accessToken", accessToken);
        state.accessToken = accessToken;
      } else {
        localStorage.setItem("accessToken", "");
        localStorage.setItem("refreshToken", "");

        state.accessToken = "";
        state.refreshToken = "";
      }

      state.isAuth = ok;
      state.isLoading = false;
    })
    .addCase(renewAccessToken.rejected, (state) => {
      localStorage.setItem("accessToken", "");
      localStorage.setItem("refreshToken", "");

      state.accessToken = "";
      state.refreshToken = "";
      state.isAuth = false;
      state.isLoading = false;
    });
};
