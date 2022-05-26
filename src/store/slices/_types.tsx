import { Delta } from "quill";
import { TranScriptType } from "components/MediaPlayer/VideoPlayer/_types";

// users.slice.tsx -----------------
export interface UserType {
  id: string;
  name: string;
  realname: string;
  email: string;
  timeZone: string;
  isOnline?: boolean;
  avatar?: string;
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
  createdTime: number;
  channels: string[];
  users: string[];
}

export interface TeamsState {
  isLoading: boolean;
  list: TeamType[];
  selectedId: string;
}

// messages.slice.tsx -----------------
export type DayMessageType =
  | { day: string; message?: MessageType; userOwner?: UserType }
  | { day?: string; message: MessageType; userOwner?: UserType };

export interface MessageFileType {
  id: string;
  url: string;
  createdTime: number;
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
  createdTime: number;
  updatedTime: number;
  team: string;
  user: string;
  isOwner?: boolean;
  isEdited?: boolean;
  isStared?: boolean;
  reactions: Record<string, { id: string; users: string[]; count: number }>;
  files?: MessageFileType[];
}

export interface MessagesState {
  isLoading: boolean;
  list: MessageType[];
  dayMessageList: DayMessageType[];
}

// channels.slice.tsx -----------------
export interface ChannelType {
  id: string;
  name: string;
  type: "direct_message" | "channel";
  users: string[];
  creater: string;
  createdTime: number;
  unreadMessageCount: number;
  updatedTime: number;
}

export interface ChannelsState {
  isLoading: boolean;
  list: ChannelType[];
  directMessages: ChannelType[];
  selectedId: string;
}
