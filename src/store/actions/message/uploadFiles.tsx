import { createAsyncThunk } from "@reduxjs/toolkit";
import { AxiosResponse } from "axios";

// redux selectors
import * as authSelector from "store/selectors/auth.selector";
import * as teamsSelector from "store/selectors/teams.selector";
import * as channelsSelector from "store/selectors/channels.selector";

// utils
import axios from "utils/axios";

// types
import { RootState } from "store";
import { GetUserInformationResponseData } from "store/actions/auth/_types";
import { MessageFilesPostData } from "./_types";

export const uploadFiles = createAsyncThunk<
  AxiosResponse<GetUserInformationResponseData>,
  MessageFilesPostData,
  {}
>("message/uploadFiles", async (postData, thunkAPI) => {
  const formData = new FormData();
  const state: RootState = thunkAPI.getState() as RootState;
  const userId = authSelector.getUserId(state);
  const teamId = teamsSelector.getSelectedTeamId(state);
  const channelId = channelsSelector.getSelectedChannelId(state);

  const files: { id: string; blob: Blob }[] = [];
  const delta = postData.delta;
  const fileData = [];

  for (const file of postData.files) {
    // get blob from blob:url
    const res = await fetch(file.url);
    const fileBlob = await res.blob();
    if (fileBlob.size) files.push({ id: file.id, blob: fileBlob });

    if (file.thumb) {
      const res = await fetch(file.thumb);
      const thumbBlob = await res.blob();
      if (thumbBlob.size) files.push({ id: file.id, blob: thumbBlob });
    }
    fileData.push({ ...file, url: "", thumb: "" });
  }

  formData.append("delta", new Blob([JSON.stringify(delta)], { type: "application/json" }));
  formData.append("fileData", new Blob([JSON.stringify(fileData)], { type: "application/json" }));
  files.forEach((file) => formData.append("file", file.blob, file.id));

  const response = await axios.post("message/upload-files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { userId, teamId, channelId },
  });
  return response;
});
