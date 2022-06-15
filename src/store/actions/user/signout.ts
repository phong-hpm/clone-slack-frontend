import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";

// types
import { UserState } from "store/slices/_types";

export const signout = createAsyncThunk("user/signout", async (postData, thunkAPI) => {});

export const userExtraReducers = (builder: ActionReducerMapBuilder<UserState>) => {
  builder
    .addCase(signout.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(signout.fulfilled, (state) => {
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("accessToken");
      localStorage.removeItem("updatedTime");

      state.accessToken = "";
      state.refreshToken = "";
      state.isAuth = false;
      state.isLoading = false;
    });
};
