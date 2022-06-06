import { Socket } from "socket.io-client";
import { ChannelType, MessageType, UserType } from "store/slices/_types";

// ChannelSocketContext.tsx -----------------
export type LoadChannelsListener = (data: { channels: ChannelType[]; users: UserType[] }) => void;
export type AddNewChannelListener = (channel: ChannelType) => void;
export type UpdatedChannelListener = (channel: ChannelType) => void;
export type UpdatedChannelUsersListener = (data: {
  channelId: string;
  userId: string[];
  users: UserType[];
}) => void;
export type UpdateChannelUserStatusListener = (channelId: string, isOnline: boolean) => void;

export type UpdateChannelUpdatedTimeListener = (data: {
  channelId: string;
  updatedTime: number;
}) => void;

export type UpdateChannelUnreadMessageCountListener = (data: {
  channelId: string;
  unreadMessageCount: number;
}) => void;

// MessageSocketContext.tsx -----------------
export interface MessageContextType {
  socket?: Socket;
  updateNamespace: (name: string) => void;
}

export type LoadMessagesListener = (data: {
  hasMore: boolean;
  channelId: string;
  messages: MessageType[];
  updatedTime: number;
}) => void;

export type AddNewMessageListener = (data: {
  channelId: string;
  message: MessageType;
  updatedTime: number;
}) => void;

export type ShareMessageToChannelListener = (data: {
  toChannelId: string;
  message: MessageType;
  updatedTime: number;
}) => void;

export type UploadMessageListener = (data: {
  channelId: string;
  message: MessageType;
  updatedTime: number;
}) => void;

export type RemoveMessageListener = (data: {
  channelId: string;
  messageId: string;
  updatedTime: number;
}) => void;
