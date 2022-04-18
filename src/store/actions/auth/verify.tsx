import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

import axios from "../../../utils/axios";
import { AuthState } from "../../slices/auth.slice";

export interface VerifyResponseData {
  verified: boolean;
}

export const verify = createAsyncThunk<AxiosResponse<VerifyResponseData>>(
  "auth/verify",
  async () => {
    const response = await axios.get("auth/verify");
    return response;
  }
);

export const extraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(verify.pending, (state) => {
      state.isVerified = true;
      state.isLoading = true;
    })
    .addCase(verify.fulfilled, (state, action) => {
      state.isAuth = action.payload.data.verified;
      state.isLoading = false;
    })
    .addCase(verify.rejected, (state) => {
      state.isAuth = false;
      state.isLoading = false;
    });
};
