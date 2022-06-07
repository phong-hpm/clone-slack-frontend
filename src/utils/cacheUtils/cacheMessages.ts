import { MessageType } from "store/slices/_types";

export const getCachedMessages = (channelId: string) => {
  const result = { hasMore: false, channelId: "", messages: [] as MessageType[] };
  try {
    const dataString = localStorage.getItem(channelId);
    const data = JSON.parse(dataString || "{}");

    if (data.channelId) result.channelId = data.channelId;
    if (Array.isArray(data.messages)) result.messages = data.messages;
  } catch {
  } finally {
    return result;
  }
};

export const addCachedMessage = (data: { channelId: string; message: MessageType }) => {
  try {
    const { channelId, message } = data;
    const cachedData = getCachedMessages(channelId);
    cachedData.messages.push(message);

    localStorage.setItem(channelId, JSON.stringify(cachedData));
  } catch {}
};

export const updateCachedMessage = (data: { channelId: string; message: MessageType }) => {
  try {
    const { channelId, message } = data;
    const cachedData = getCachedMessages(channelId);

    const index = cachedData.messages.findIndex(({ id }) => id === message.id);
    cachedData.messages[index] = message;

    localStorage.setItem(channelId, JSON.stringify(cachedData));
  } catch {}
};

export const removeCachedMessage = (data: { channelId: string; messageId: string }) => {
  try {
    const { channelId, messageId } = data;
    const cachedData = getCachedMessages(channelId);

    cachedData.messages = cachedData.messages.filter(({ id }) => id !== messageId);

    localStorage.setItem(channelId, JSON.stringify(cachedData));
  } catch {}
};

export const removeCachedMessages = (data: { channelId: string }) => {
  try {
    const { channelId } = data;
    localStorage.removeItem(channelId);
  } catch {}
};

export const setCachedMessages = (data: {
  hasMore: boolean;
  channelId: string;
  messages: MessageType[];
}) => {
  localStorage.setItem(data.channelId, JSON.stringify(data));
};
