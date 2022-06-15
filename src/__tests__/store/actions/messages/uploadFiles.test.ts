// store
import { setupStore } from "store";

// redux action
import { uploadFiles } from "store/actions/message/uploadFiles";

// utils
import { apiUrl } from "utils/constants";
import { mockAxios, waitFor } from "__tests__/__setups__";

// types
import { Delta } from "quill";
import { MessageFilesPostData } from "store/actions/message/_types";

let store = setupStore();

beforeEach(() => {
  store = setupStore();
});

test("Test uploadFiles", async () => {
  let sentData: FormData;
  const mockSuccess = jest.fn();
  mockAxios.onPost(apiUrl.message.uploadFile).reply(({ data }) => {
    sentData = data;
    mockSuccess();
    return [200, { ok: true }];
  });
  jest.spyOn(window, "fetch").mockImplementation(
    () =>
      Promise.resolve({
        blob: () => Promise.resolve(new Blob(["test"])),
      }) as any
  );

  const postData: MessageFilesPostData = {
    delta: { ops: [{ insert: "hi\n" }] } as unknown as Delta,
    files: [
      {
        id: "file_audio_1",
        url: "blob:http://localhost:3000",
        type: "audio",
        mineType: "audio/webm",
        duration: 65,
        createdTime: Date.now(),
      },
      {
        id: "file_video_1",
        url: "blob:http://localhost:3000",
        type: "video",
        mineType: "video/webm",
        duration: 65,
        createdTime: Date.now(),
        thumb: "http://example/thumb",
        thumbList: ["http://example/thumb_1", "http://example/thumb_2"],
      },
    ],
  };
  store.dispatch(uploadFiles(postData));

  await waitFor(() => {
    expect(mockSuccess).toBeCalledWith();
    expect(sentData.get("delta")).not.toBeNull();
    expect(sentData.get("fileData")).not.toBeNull();
    expect(sentData.getAll("file")).toHaveLength(2);
    expect(sentData.getAll("thumb")).toHaveLength(1);
    expect(sentData.getAll("thumbList")).toHaveLength(2);
  });
});
