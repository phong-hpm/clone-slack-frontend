import { Socket } from "socket.io-client";
import { Delta } from "quill";
import { TranScriptType } from "components/MediaPlayer/VideoPlayer/_types";

// modal.slice.tsx -----------------
export interface GlobalModalState {
  isOpenAddUserChannel: boolean;
  isOpenCreateChannel: boolean;
  isOpenChannelDetail: boolean;
  isOpenEditChannelNameModal: boolean;
  isOpenEditChannelTopicModal: boolean;
  isOpenEditChannelDescriptionModal: boolean;
  isOpenArchiveChannelModal: boolean;
}

// channelUsers.slice.tsx -----------------
export interface TeamUsersState {
  isLoading: boolean;
  list: UserType[];
}

// channelUsers.slice.tsx -----------------
export interface UserType {
  id: string;
  name: string;
  realname?: string;
  email: string;
  timeZone: string;
  isOnline?: boolean;
  avatar?: string;
  workspaceUrl?: string;
}

export interface ChannelUsersState {
  isLoading: boolean;
  list: UserType[];
}

// auth.slice.tsx -----------------
export interface UserState {
  accessToken: string;
  refreshToken: string;
  isAuth: boolean;
  isLoading: boolean;
  user: UserType;
  emailVerifying?: string;
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
  isWaiting: boolean;
  isLoading: boolean;
  list: TeamType[];
  selectedId: string;
}

export interface SocketState {
  channelSocket?: Socket;
  messageSocket?: Socket;
}

// messages.slice.tsx -----------------
export interface MessageFileType {
  id: string;
  url: string;
  createdTime: number;
  type: "image" | "audio" | "video";
  mineType: "image/png" | "audio/webm" | "video/webm";
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
  isEdited?: boolean;
  isStarred?: boolean;
  reactions: Record<string, { id: string; users: string[]; count: number }>;
  files?: MessageFileType[];
  sharedMessageId?: string;
  sharedMessage?: Omit<MessageType, "sharedMessage" | "sharedMessageId">;
  sharedMessageOwner?: UserType;
}

export type DayMessageType =
  | {
      type: "panel" | "loading" | "day" | "message";
      day?: string;
      message?: MessageType;
      userOwner?: UserType;
    }
  | {
      type?: "panel" | "loading" | "day" | "message";
      day: string;
      message?: MessageType;
      userOwner?: UserType;
    }
  | {
      type?: "panel" | "loading" | "day" | "message";
      day?: string;
      message: MessageType;
      userOwner?: UserType;
    };

export interface MessagesState {
  isLoading: boolean;
  list: MessageType[];
  hasMore: boolean;
  dayMessageList: DayMessageType[];
}

// channels.slice.tsx -----------------
export interface ChannelType {
  id: string;
  type: "general" | "public_channel" | "private_channel" | "direct_message" | "group_message";
  name: string;
  users: string[];
  creator: string;
  createdTime: number;
  unreadMessageCount: number;
  updatedTime: number;
  desc?: string;
  partner?: UserType;
  avatar?: string;
  topic?: string;
  notification?: "all" | "mention" | "off";
  isStarred?: boolean;
  isMuted?: boolean;
}

export interface ChannelsState {
  isLoading: boolean;
  list: ChannelType[];
  selectedId: string;
}
