import { TranScriptType } from "components/MediaPlayer/VideoPlayer/_types";
import { Delta } from "quill";

// users.slice.tsx -----------------
export interface UserType {
  id: string;
  name: string;
  realname: string;
  email: string;
  timeZone: string;
  isOnline?: boolean;
}

export interface UsersState {
  isLoading: boolean;
  list: UserType[];
  selected: string;
}

// auth.slice.tsx -----------------
export interface AuthState {
  accessToken: string;
  refreshToken: string;
  isAuth: boolean;
  isLoading: boolean;
  isVerified: boolean;
  user: UserType;
}

// teams.slice.tsx -----------------
export interface TeamType {
  id: string;
  name: string;
  created: number;
  channels: string[];
  users: string[];
}

export interface TeamsState {
  isLoading: boolean;
  list: TeamType[];
  selectedId: string;
}

// messages.slice.tsx -----------------
export interface MessageFileType {
  id: string;
  url: string;
  created: number;
  type: "audio" | "video";
  mineType: "audio/webm" | "video/webm";
  duration: number;
  size?: number;
  wavePeaks?: number[];
  scripts?: TranScriptType[];
  ratio?: number;
  thumb?: string;
  thumbList?: string[];
  status?: "uploading" | "done";
}

export interface MessageType {
  id: string;
  type: string;
  delta: Delta;
  created: number;
  team: string;
  user: string;
  isOwner?: boolean;
  isEdited?: boolean;
  isStared?: boolean;
  reactions: { id: string; users: string[]; count: number }[];
  files?: MessageFileType[];
}

export interface MessagesState {
  isLoading: boolean;
  list: MessageType[];
  latestModify: number;
}

// channels.slice.tsx -----------------
export interface ChannelType {
  id: string;
  name: string;
  type: "direct_message" | "channel";
  isAllUser: boolean;
  users: string[];
  creater: string;
  latest: number;
  created: number;
}

export interface ChannelsState {
  isLoading: boolean;
  list: ChannelType[];
  directMessages: ChannelType[];
  selectedId: string;
}
