import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// types
import { ModalState } from "store/slices/_types";

const initialState: ModalState = {
  isOpenAddUserChannel: false,
  isOpenCreateChannel: false,
  isOpenChannelDetail: false,
  isOpenEditChannelNameModal: false,
  isOpenEditChannelTopicModal: false,
  isOpenEditChannelDescriptionModal: false,
  isOpenArchiveChannelModal: false,
};

export const globalModalSlice = createSlice({
  name: "globalModal",
  initialState,
  reducers: {
    setOpenAddUserChannelModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenAddUserChannel = action.payload;
    },
    setOpenCreateChannelModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenCreateChannel = action.payload;
    },
    setOpenChannelDetailModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenChannelDetail = action.payload;
    },
    setOpenEditChannelNameModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenEditChannelNameModal = action.payload;
    },
    setOpenEditChannelTopicModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenEditChannelTopicModal = action.payload;
    },
    setOpenEditChannelDescriptionModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenEditChannelDescriptionModal = action.payload;
    },
    setOpenArchiveChannelModal: (state, action: PayloadAction<boolean>) => {
      state.isOpenArchiveChannelModal = action.payload;
    },
  },
});

export const {
  setOpenAddUserChannelModal,
  setOpenCreateChannelModal,
  setOpenChannelDetailModal,
  setOpenEditChannelNameModal,
  setOpenEditChannelTopicModal,
  setOpenEditChannelDescriptionModal,
  setOpenArchiveChannelModal,
} = globalModalSlice.actions;

export default globalModalSlice.reducer;
