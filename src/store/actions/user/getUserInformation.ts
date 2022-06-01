import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";

// utils
import axios from "utils/axios";
import { stateDefault } from "utils/constants";

// types
import { AuthState, TeamsState } from "store/slices/_types";
import { GetUserInformationResponseData } from "store/actions/user/_types";
import { AxiosResponseCustom } from "store/actions/_types";

export const getUserInformation = createAsyncThunk<
  AxiosResponseCustom<GetUserInformationResponseData>
>("auth/getUserInformation", async () => {
  const response = await axios.get("auth/user");
  return response;
});

export const authExtraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(getUserInformation.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getUserInformation.fulfilled, (state, action) => {
      const { ok = false, user } = action.payload.data;
      if (ok) {
        state.user = user;
      }

      state.isAuth = ok;
      state.isLoading = false;
    })
    .addCase(getUserInformation.rejected, (state) => {
      state.user = stateDefault.USER;
      state.isAuth = false;
      state.isLoading = false;
    });
};

export const teamsExtraReducers = (builder: ActionReducerMapBuilder<TeamsState>) => {
  builder
    .addCase(getUserInformation.pending, (state) => {
      state.list = [];
      state.isLoading = true;
    })
    .addCase(getUserInformation.fulfilled, (state, action) => {
      const { user } = action.payload.data;

      state.list = user.teams;
      state.isLoading = false;
    })
    .addCase(getUserInformation.rejected, (state) => {
      state.isLoading = false;
    });
};
