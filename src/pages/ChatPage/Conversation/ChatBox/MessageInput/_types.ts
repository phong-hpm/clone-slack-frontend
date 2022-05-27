import ReactQuill from "react-quill";
import { RangeStatic } from "quill";
import { UserType, MessageFileType } from "store/slices/_types";

// InputContext.tsx -----------------
export interface ContextLinkValueType {
  text: string;
  href: string;
  url: string;
  isEditable?: boolean;
}

export interface ContextQuillStateType {
  range: RangeStatic;
  blotRange: RangeStatic;
  blot: any;
}

export interface ContextAppStateType {
  isFocus: boolean;
  userMention: UserType;
  inputFiles: MessageFileType[];
  configActions: {
    more?: boolean;
    recordVideo?: boolean;
    recordAudio?: boolean;
    emoji?: boolean;
    mention?: boolean;
    cancel?: boolean;
    send?: boolean;
    schedule?: boolean;
  };
}

export interface InputContextType {
  quillReact?: ReactQuill;
  setQuillReact: (quillReact: ReactQuill) => void;
  quillState: ContextQuillStateType;
  updateQuillState: (data: Partial<ContextQuillStateType>) => void;
  appState: ContextAppStateType;
  updateAppState: (data: Partial<ContextAppStateType>) => void;
  setFocus: (isFocus: boolean, index?: number) => void;
  setInputFile: (file: MessageFileType) => void;
  updateInputFile: (file: Partial<MessageFileType>) => void;
  removeInputFile: (id: string) => void;
}

// useQuillReact.tsx -----------------
export interface LinkCustomEventDetailType {
  quillReact?: ReactQuill;
  anchorEl?: HTMLSpanElement;
  linkValue?: ContextLinkValueType;
  range?: RangeStatic;
  blotRange?: RangeStatic;
  setFocus?: (isFocus: boolean, index?: number) => void;
}

// VideoRecordModal.tsx -----------------
export interface MediaDeviceInfoType {
  deviceId: string;
  groupId: string;
  kind: string;
  label: string;
}
