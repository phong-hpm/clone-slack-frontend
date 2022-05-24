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

const getBlobFromUrl = async (url: string) => {
  const res = await fetch(url);
  return await res.blob();
};

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
  const thumbs: { id: string; blob: Blob }[] = [];
  const thumbList: { id: string; blob: Blob }[] = [];
  const delta = postData.delta;
  const fileData = [];

  for (const file of postData.files) {
    // get blob from blob:url
    const fileBlob = await getBlobFromUrl(file.url);
    if (fileBlob.size) files.push({ id: file.id, blob: fileBlob });

    if (file.thumb) {
      const thumbBlob = await getBlobFromUrl(file.thumb);
      if (thumbBlob.size) thumbs.push({ id: file.id, blob: thumbBlob });
    }

    if (file.thumbList) {
      for (const thumbnail of file.thumbList) {
        const thumbBlob = await getBlobFromUrl(thumbnail);
        thumbList.push({ id: file.id, blob: thumbBlob });
      }
    }
    fileData.push({ ...file, url: "", thumb: "", thumbList: [] });
  }

  formData.append("delta", new Blob([JSON.stringify(delta)], { type: "application/json" }));
  formData.append("fileData", new Blob([JSON.stringify(fileData)], { type: "application/json" }));
  files.forEach((file) => formData.append("file", file.blob, file.id));
  thumbs.forEach((thumb) => formData.append("thumb", thumb.blob, thumb.id));
  thumbList.forEach((thumb) => formData.append("thumbList", thumb.blob, thumb.id));

  const response = await axios.post("message/upload-files", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { userId, teamId, channelId },
  });
  return response;
});
