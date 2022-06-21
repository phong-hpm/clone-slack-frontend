import { createAsyncThunk } from "@reduxjs/toolkit";

// redux selectors
import userSelectors from "store/selectors/user.selector";
import teamsSelectors from "store/selectors/teams.selector";
import channelsSelectors from "store/selectors/channels.selector";

// utils
import axios from "utils/axios";
import { apiUrl } from "utils/constants";

// types
import { RootState } from "store/_types";
import { GetUserInformationResponseData } from "store/actions/user/_types";
import { MessageFilesPostData } from "./_types";
import { AxiosResponseCustom } from "store/actions/_types";

const getBlobFromUrl = async (url: string) => {
  const res = await fetch(url);
  return await res.blob();
};

export const uploadFiles = createAsyncThunk<
  AxiosResponseCustom<GetUserInformationResponseData>,
  MessageFilesPostData,
  {}
>("message/uploadFiles", async (postData, thunkAPI) => {
  const formData = new FormData();
  const state: RootState = thunkAPI.getState() as RootState;
  const userId = userSelectors.getUserId(state);
  const teamId = teamsSelectors.getSelectedTeamId(state);
  const channelId = channelsSelectors.getSelectedChannelId(state);

  const videos: { id: string; blob: Blob }[] = [];
  const audios: { id: string; blob: Blob }[] = [];
  const images: { id: string; blob: Blob }[] = [];
  const thumbs: { id: string; blob: Blob }[] = [];
  const thumbList: { id: string; blob: Blob }[] = [];
  const delta = postData.delta;
  const fileData = [];

  for (const file of postData.files) {
    // get blob from blob:url
    const fileBlob = await getBlobFromUrl(file.url);

    if (fileBlob.size) {
      if (file.type === "video") videos.push({ id: file.id, blob: fileBlob });
      if (file.type === "audio") audios.push({ id: file.id, blob: fileBlob });
      if (file.type === "image") images.push({ id: file.id, blob: fileBlob });
    }

    if (file.thumb) {
      const thumbBlob = await getBlobFromUrl(file.thumb);
      thumbBlob.size && thumbs.push({ id: file.id, blob: thumbBlob });
    }

    if (file.thumbList) {
      for (const thumbnail of file.thumbList) {
        const thumbBlob = await getBlobFromUrl(thumbnail);
        thumbBlob.size && thumbList.push({ id: file.id, blob: thumbBlob });
      }
    }
    fileData.push({ ...file, url: "", thumb: "", thumbList: [] });
  }

  formData.append("delta", new Blob([JSON.stringify(delta)], { type: "application/json" }));
  formData.append("fileData", new Blob([JSON.stringify(fileData)], { type: "application/json" }));

  images.forEach((image) => formData.append("images", image.blob, image.id));
  audios.forEach((audio) => formData.append("audios", audio.blob, audio.id));
  videos.forEach((video) => formData.append("videos", video.blob, video.id));
  thumbs.forEach((thumb) => formData.append("thumb", thumb.blob, thumb.id));
  thumbList.forEach((thumb) => formData.append("thumbList", thumb.blob, thumb.id));

  const response = await axios.post(apiUrl.message.uploadFile, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    params: { userId, teamId, channelId },
  });
  return response;
});
