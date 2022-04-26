import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

// redux slices
import { AuthState } from "../../slices/auth.slice";
import { TeamType, TeamsState } from "../../slices/teams.slice";
import { UserType } from "../../slices/users.slice";

// utils
import axios from "../../../utils/axios";

export interface VerifyResponseData {
  verified: boolean;
  user: UserType;
  teams: TeamType[];
}

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
      state.user = { id: "", email: "", name: "", timeZone: "" };
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
