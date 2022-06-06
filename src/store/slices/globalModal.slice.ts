import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { ModalState } from "store/slices/_types";

const initialState: ModalState = {
  isOpenAddUserChannel: false,
};

export const globalModalSlice = createSlice({
  name: "globalModal",
  initialState,
  reducers: {
    setOpenAddUserChannel: (state, action: PayloadAction<boolean>) => {
      state.isOpenAddUserChannel = action.payload;
    },
  },
});

export const { setOpenAddUserChannel } = globalModalSlice.actions;

export default globalModalSlice.reducer;
