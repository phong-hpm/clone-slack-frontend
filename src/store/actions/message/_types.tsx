import { MessageFileType } from "store/slices/_types";

// uploadFIles.tsx  -----------------
export interface MessageFilesPostData {
  id: string;
  files: MessageFileType[];
}
