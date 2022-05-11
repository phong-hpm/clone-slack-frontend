import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

// utils
import axios from "utils/axios";
import { stateDefault } from "utils/constants";

// types
import { AuthState, TeamsState } from "store/slices/_types";
import { GetUserInformationResponseData } from "store/actions/auth/_types";

export const getUserInformation = createAsyncThunk<AxiosResponse<GetUserInformationResponseData>>(
  "auth/getUserInformation",
  async () => {
    const response = await axios.get("auth/user");
    return response;
  }
);

export const authExtraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(getUserInformation.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(getUserInformation.fulfilled, (state, action) => {
      const { user } = action.payload.data;

      state.isAuth = true;
      state.user = {
        id: user.id,
        email: user.email,
        name: user.name,
        realname: user.realname,
        timeZone: user.timeZone,
      };
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
      // state.selectedId = state.list[0].id || "";
      state.isLoading = false;
    })
    .addCase(getUserInformation.rejected, (state) => {
      state.isLoading = false;
    });
};
