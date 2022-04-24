import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

// redux store
import { RootState } from "../..";

// redux slices
import { AuthState } from "../../slices/auth.slice";

// utils
import axios from "../../../utils/axios";

export interface RenewAccessTokenResponseData {
  refreshToken: string;
  accessToken: string;
}

export const renewAccessToken = createAsyncThunk<AxiosResponse<RenewAccessTokenResponseData>>(
  "auth/refreshToken",
  async (_, thunkAPI) => {
    const state = thunkAPI.getState() as RootState;
    const postData = { refreshToken: state.auth.refreshToken };
    const response = await axios.post("auth/refresh-token", { postData });
    return response;
  }
);

export const authExtraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(renewAccessToken.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(renewAccessToken.fulfilled, (state, action) => {
      const { accessToken, refreshToken } = action.payload.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isLoading = false;
    })
    .addCase(renewAccessToken.rejected, (state) => {
      state.accessToken = "";
      state.refreshToken = "";
      state.isLoading = false;
    });
};
