import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// redux actions
import { teamsExtraReducers as loginExtraReducers } from "../actions/auth/login";
import { teamsExtraReducers as verifyExtraReducers } from "../actions/auth/verify";
import { teamsExtraReducers as getUserInformationExtraReducers } from "../actions/auth/getUserInformation";

export interface TeamType {
  id: string;
  name: string;
  created: number;
  channels: string[];
  users: string[];
}

export interface TeamsState {
  isLoading: boolean;
  list: TeamType[];
  selectedId: string;
}

const initialState: TeamsState = {
  isLoading: false,
  list: [],
  selectedId: "",
};

export const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setTeamsList: (state, action: PayloadAction<TeamType[]>) => {
      state.list = action.payload;
    },
    setSelectedTeamId: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    loginExtraReducers(builder);
    verifyExtraReducers(builder);
    getUserInformationExtraReducers(builder);
  },
});

export const { setTeamsList, setSelectedTeamId } = teamsSlice.actions;

export default teamsSlice.reducer;
