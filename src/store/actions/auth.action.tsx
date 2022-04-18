import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

import axios, { setAxiosHeaderToken } from "../../utils/axios";
import { AuthState } from "../slices/auth.slice";

export interface LoginPostData {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: {
    email: string;
    name: string;
  };
}

export const login = createAsyncThunk<
  AxiosResponse<LoginResponseData>,
  LoginPostData,
  { rejectValue: AxiosResponse<string> }
>("auth/login", async (postData, thunkAPI) => {
  try {
    const response = await axios.post("auth/login", { postData });
    setAxiosHeaderToken(response.data.accessToken);
    return response;
  } catch (error: any) {
    const response = error.response as AxiosResponse<string>;
    // thunkAPI.dispatch(addToast({ type: "error", message: response.data }));
    return thunkAPI.rejectWithValue(response);
  }
});

export const extraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(login.pending, (state) => {
      state.isAuth = false;
      state.isLoading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      const { data } = action.payload;

      state.isAuth = true;
      state.isLoading = false;
      state.accessToken = data.accessToken;
      state.refreshToken = data.refreshToken;
      state.user = data.user;
    })
    .addCase(login.rejected, (state) => {
      state.isAuth = false;
      state.isLoading = false;
      state.accessToken = "a";
      state.refreshToken = "";
      state.user = {
        email: "",
        name: "",
      };
    });
};
