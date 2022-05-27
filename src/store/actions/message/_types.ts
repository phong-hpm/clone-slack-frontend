import { Delta } from "quill";
import { MessageFileType } from "store/slices/_types";

// uploadFIles.tsx  -----------------
export interface MessageFilesPostData {
  files: MessageFileType[];
  delta: Delta;
}
