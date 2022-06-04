import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";

// utils
import axios from "utils/axios";

// types
import { UserState } from "store/slices/_types";
import { CheckEmailResponseData } from "store/actions/user/_types";
import { AxiosResponseCustom } from "store/actions/_types";

export const checkEmail = createAsyncThunk<
  AxiosResponseCustom<CheckEmailResponseData>,
  { email: string }
>("auth/checkEmail", async (postData, thunkAPI) => {
  const response = await axios.post("auth/check-email", { postData });
  return response;
});

export const authExtraReducers = (builder: ActionReducerMapBuilder<UserState>) => {
  builder
    .addCase(checkEmail.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(checkEmail.fulfilled, (state, action) => {
      const { ok, email } = action.payload.data;
      if (ok) {
        state.emailVerifying = email;
      }
      state.isLoading = false;
    })
    .addCase(checkEmail.rejected, (state) => {
      state.isLoading = false;
    });
};
