import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { teamsExtraReducers as loginExtraReducers } from "../actions/auth/login";
import { teamsExtraReducers as verifyExtraReducers } from "../actions/auth/verify";

export interface TeamType {
  id: string;
  name: string;
  created: number;
}

export interface TeamsState {
  isLoading: boolean;
  list: TeamType[];
  selected: string;
}

const initialState: TeamsState = {
  isLoading: false,
  list: [],
  selected: "",
};

export const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setTeamsList: (state, action: PayloadAction<TeamType[]>) => {
      state.list = action.payload;
    },
    setSelectedTeam: (state, action: PayloadAction<string>) => {
      state.selected = action.payload;
    },
  },
  extraReducers: (builder) => {
    loginExtraReducers(builder);
    verifyExtraReducers(builder);
  },
});

export const { setTeamsList, setSelectedTeam } = teamsSlice.actions;

export default teamsSlice.reducer;
