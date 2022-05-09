import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

// redux slices
import { AuthState } from "../../slices/auth.slice";
import { TeamType, TeamsState } from "../../slices/teams.slice";
import { UserType } from "../../slices/users.slice";

// utils
import axios from "../../../utils/axios";
import { stateDefault } from "../../../utils/constants";

export interface LoginPostData {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken: string;
  user: UserType;
  teams: TeamType[];
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
      state.isLoading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      const { user, accessToken, refreshToken } = action.payload.data;

      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.user = user;
      state.isAuth = true;
      state.isLoading = false;
    })
    .addCase(login.rejected, (state) => {
      localStorage.setItem("accessToken", "");
      localStorage.setItem("refreshToken", "");

      state.user = stateDefault.USER;
      state.isAuth = false;
      state.isLoading = false;
    });
};

export const teamsExtraReducers = (builder: ActionReducerMapBuilder<TeamsState>) => {
  builder
    .addCase(login.pending, (state) => {
      state.isLoading = true;
    })
    .addCase(login.fulfilled, (state, action) => {
      const { teams } = action.payload.data;

      state.list = teams;
      // state.selectedId = teams[0].id || "";
      state.isLoading = false;
    })
    .addCase(login.rejected, (state) => {
      state.list = [];
      state.selectedId = "";
      state.isLoading = false;
    });
};
