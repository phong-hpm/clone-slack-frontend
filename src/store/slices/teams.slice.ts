import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// redux actions
import { teamsExtraReducers as getUserInformationExtraReducers } from "store/actions/user/getUserInformation";

// types
import { TeamsState, TeamType } from "store/slices/_types";

const initialState: TeamsState = {
  isWaiting: true,
  isLoading: true,
  list: [],
  selectedId: "",
};

export const teamsSlice = createSlice({
  name: "teams",
  initialState,
  reducers: {
    setTeamsList: (state, action: PayloadAction<TeamType[]>) => {
      state.list = action.payload;
      state.isWaiting = false;
      state.isLoading = false;
    },
    setSelectedTeamId: (state, action: PayloadAction<string>) => {
      state.selectedId = action.payload;
    },
  },
  extraReducers: (builder) => {
    getUserInformationExtraReducers(builder);
  },
});

export const { setTeamsList, setSelectedTeamId } = teamsSlice.actions;

export default teamsSlice.reducer;
