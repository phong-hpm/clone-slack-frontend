import { ActionReducerMapBuilder, createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

// utils
import axios from "utils/axios";
import { stateDefault } from "utils/constants";

// types
import { AuthState, TeamsState } from "store/slices/_types";
import { GetUserInformationResponseData } from "store/actions/auth/_types";
import { MessageFilesPostData } from "./_types";

export const uploadFiles = createAsyncThunk<
  AxiosResponse<GetUserInformationResponseData>,
  MessageFilesPostData,
  { rejectValue: AxiosResponse<string> }
>("message/uploadFiles", async (postData, thunkAPI) => {
  const formData = new FormData();

  const filesInfo = postData.files.map((file) => ({ ...file, url: undefined }));
  const files: { id: string; blob: Blob }[] = [];

  for (const file of postData.files) {
    // get blob from blob:url
    const res = await fetch(file.url);
    const blob = await res.blob();
    files.push({ id: file.id, blob });
  }

  formData.append("id", postData.id);
  formData.append("filesInfo", filesInfo.toString());
  files.forEach((file) => formData.append("file", file.blob, file.id));

  console.log(files);

  const response = await axios.post("message/files");
  return response;
});

export const teamsExtraReducers = (builder: ActionReducerMapBuilder<TeamsState>) => {
  builder
    .addCase(uploadFiles.pending, (state) => {
      state.list = [];
      state.isLoading = true;
    })
    .addCase(uploadFiles.fulfilled, (state, action) => {
      const { user } = action.payload.data;

      state.list = user.teams;
      // state.selectedId = state.list[0].id || "";
      state.isLoading = false;
    })
    .addCase(uploadFiles.rejected, (state) => {
      state.isLoading = false;
    });
};
