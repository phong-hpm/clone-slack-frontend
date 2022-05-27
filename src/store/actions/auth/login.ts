import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

// utils
import axios from "utils/axios";

// types
import { AuthState } from "store/slices/_types";
import { LoginPostData, LoginResponseData } from "store/actions/auth/_types";

export const login = createAsyncThunk<
  AxiosResponse<LoginResponseData>,
  LoginPostData,
  { rejectValue: AxiosResponse<string> }
>("auth/login", async (postData, thunkAPI) => {
  try {
    const response = await axios.post("auth/login", { postData });
    return response;
  } catch (error: any) {
    const response = error.response as AxiosResponse<string>;
    return thunkAPI.rejectWithValue(response);
  }
});

export const authExtraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(login.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      const { accessToken, refreshToken } = action.payload.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuth = true;
      state.isLoading = false;
    })
    .addCase(login.rejected, (state) => {
      localStorage.setItem("accessToken", "");
      localStorage.setItem("refreshToken", "");

      state.isAuth = false;
      state.isLoading = false;
    });
};
