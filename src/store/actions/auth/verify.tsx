import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

// utils
import axios from "../../../utils/axios";
import { stateDefault } from "../../../utils/constants";

// types
import { AuthState, TeamsState } from "store/slices/_types";
import { VerifyResponseData } from "./_types";

export const verify = createAsyncThunk<AxiosResponse<VerifyResponseData>>(
  "auth/verify",
  async () => {
    const response = await axios.get("auth/verify");
    return response;
  }
);

export const authExtraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(verify.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(verify.fulfilled, (state, action) => {
      const { verified, user } = action.payload.data;

      state.isAuth = verified;
      state.isVerified = true;
      if (verified) state.user = user;
      state.isLoading = false;
    })
    .addCase(verify.rejected, (state) => {
      state.isAuth = false;
      state.isVerified = true;
      state.user = stateDefault.USER;
      state.isLoading = false;
    });
};

export const teamsExtraReducers = (builder: ActionReducerMapBuilder<TeamsState>) => {
  builder
    .addCase(verify.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(verify.fulfilled, (state, action) => {
      const { data } = action.payload;

      if (data.verified) state.list = [...data.teams].sort((a, b) => a.created - b.created);
      state.isLoading = false;
    })
    .addCase(verify.rejected, (state) => {
      state.list = [];
      state.selectedId = "";
      state.isLoading = false;
    });
};
