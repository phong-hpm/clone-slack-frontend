import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

import axios from "../../../utils/axios";

import { AuthState } from "../../slices/auth.slice";
import { ChanelType } from "../../slices/chanels.slice";
import { TeamType, TeamsState } from "../../slices/teams.slice";
import { UserType } from "../../slices/users.slice";

export interface LoginPostData {
  email: string;
  password: string;
}

export interface TeamResponseData extends TeamType {
  chanels: ChanelType[];
  users: UserType[];
}

export interface LoginResponseData {
  user: UserType;
  teams: TeamResponseData[];
}

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
    // thunkAPI.dispatch(addToast({ type: "error", message: response.data }));
    return thunkAPI.rejectWithValue(response);
  }
});

export const authExtraReducers = (builder: ActionReducerMapBuilder<AuthState>) => {
  builder
    .addCase(login.pending, (state) => {
      state.isAuth = false;
      state.user = {
        id: "",
        email: "",
        name: "",
        timeZone: "",
      };

      state.isLoading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      const { data } = action.payload;

      state.isAuth = true;
      state.user = data.user;

      state.isLoading = false;
    })
    .addCase(login.rejected, (state) => {
      state.isLoading = false;
    });
};

export const teamsExtraReducers = (builder: ActionReducerMapBuilder<TeamsState>) => {
  builder
    .addCase(login.pending, (state) => {
      state.list = [];

      state.isLoading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      const { data } = action.payload;

      state.list = data.teams;
      state.selected = data.teams[0].id || "";

      state.isLoading = false;
    })
    .addCase(login.rejected, (state) => {
      state.isLoading = false;
    });
};
