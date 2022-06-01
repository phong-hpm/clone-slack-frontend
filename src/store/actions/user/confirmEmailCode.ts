import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";

// utils
import axios from "utils/axios";

// types
import { AuthState } from "store/slices/_types";
import { LoginResponseData } from "store/actions/user/_types";
import { AxiosResponseCustom } from "store/actions/_types";

export const confirmEmailCode = createAsyncThunk<
  AxiosResponseCustom<LoginResponseData>,
  { email: string; verifyCode: string }
>("auth/confirmEmailCode", async (postData, thunkAPI) => {
  try {
    const response = await axios.post("auth/confirm-email-code", { postData });
    return response;
  } catch (error: any) {
    const response = error.response;
    return thunkAPI.rejectWithValue(response);
  }
});

export const authExtraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(confirmEmailCode.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(confirmEmailCode.fulfilled, (state, action) => {
      const { ok = false, accessToken, refreshToken } = action.payload.data;

      if (ok && accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
      }

      state.isAuth = ok;
      state.isLoading = false;
    })
    .addCase(confirmEmailCode.rejected, (state) => {
      localStorage.setItem("accessToken", "");
      localStorage.setItem("refreshToken", "");
      state.accessToken = "";
      state.refreshToken = "";

      state.isAuth = false;
      state.isLoading = false;
    });
};