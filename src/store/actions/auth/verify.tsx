import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

import axios from "../../../utils/axios";
import { AuthState } from "../../slices/auth.slice";
import { ChanelType } from "../../slices/chanels.slice";
import { TeamType, TeamsState } from "../../slices/teams.slice";
import { UserType } from "../../slices/users.slice";

export interface TeamResponseData extends TeamType {
  chanels: ChanelType[];
  users: UserType[];
}

export interface VerifyResponseData {
  verified: boolean;
  user: UserType;
  teams: TeamResponseData[];
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
      state.isAuth = false;
      state.isVerified = true;
      state.isLoading = true;
      state.user = {
        id: "",
        email: "",
        name: "",
        timeZone: "",
      };
    })
    .addCase(verify.fulfilled, (state, action) => {
      const { verified, user } = action.payload.data;
      state.isAuth = verified;
      if (verified) state.user = user;
      state.isLoading = false;
    })
    .addCase(verify.rejected, (state) => {
      state.isLoading = false;
    });
};

export const teamsExtraReducers = (builder: ActionReducerMapBuilder<TeamsState>) => {
  builder
    .addCase(verify.pending, (state) => {
      state.list = [];
      state.selected = "";

      state.isLoading = true;
    })
    .addCase(verify.fulfilled, (state, action) => {
      const { data } = action.payload;

      if (data.verified) {
        state.list = [...data.teams].sort((a, b) => a.created - b.created);
        state.selected = state.list[0].id || "";
      }

      state.isLoading = false;
    })
    .addCase(verify.rejected, (state) => {
      state.isLoading = false;
    });
};
