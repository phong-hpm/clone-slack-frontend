import { MessageType } from "store/slices/_types";

export const getCachedMessages = (channelId: string) => {
  const result = { channelId: "", messages: [] as MessageType[] };
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

export const addCachedMessage = ({
  channelId,
  message,
}: {
  channelId: string;
  message: MessageType;
}) => {
  try {
    const data = getCachedMessages(channelId);
    data.messages.push(message);

    localStorage.setItem(channelId, JSON.stringify(data));
  } catch {}
};

export const updateCachedMessage = ({
  channelId,
  message,
}: {
  channelId: string;
  message: MessageType;
}) => {
  try {
    const data = getCachedMessages(channelId);

    const index = data.messages.findIndex(({ id }) => id === message.id);
    data.messages[index] = message;

    localStorage.setItem(channelId, JSON.stringify(data));
  } catch {}
};

export const removeCachedMessage = ({
  channelId,
  messageId,
}: {
  channelId: string;
  messageId: string;
}) => {
  try {
    const data = getCachedMessages(channelId);

    data.messages = data.messages.filter(({ id }) => id !== messageId);

    localStorage.setItem(channelId, JSON.stringify(data));
  } catch {}
};

export const setCachedMessages = ({
  channelId,
  messages,
}: {
  channelId: string;
  messages: MessageType[];
}) => {
  const data = { channelId, messages };
  localStorage.setItem(channelId, JSON.stringify(data));
};
