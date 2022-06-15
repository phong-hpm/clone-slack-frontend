import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";

// utils
import axios from "utils/axios";
import { apiUrl } from "utils/constants";

// types
import { UserState } from "store/slices/_types";
import { LoginResponseData } from "store/actions/user/_types";
import { AxiosResponseCustom } from "store/actions/_types";

export const confirmEmailCode = createAsyncThunk<
  AxiosResponseCustom<LoginResponseData>,
  { email: string; verifyCode: string }
>("auth/confirmEmailCode", async (postData, thunkAPI) => {
  const response = await axios.post(apiUrl.auth.confirmEmailCode, { postData });
  return response;
});

export const authExtraReducers = (builder: ActionReducerMapBuilder<UserState>) => {
  builder
    .addCase(confirmEmailCode.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(confirmEmailCode.fulfilled, (state, action) => {
      const { ok, accessToken, refreshToken } = action.payload.data;

      if (!!ok && accessToken && refreshToken) {
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        state.accessToken = accessToken;
        state.refreshToken = refreshToken;
      }

      state.isAuth = !!ok;
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
