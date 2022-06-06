export type CacheUpdatedTimeType = Record<string, Record<string, number>>;

const getLocalStorageUpdatedTime = () => {
  let result: CacheUpdatedTimeType = {};
  try {
    const dataString = localStorage.getItem("updatedTime") || "";
    const data = JSON.parse(dataString);
    result = data;
  } catch {
    // when [updatedTime] did not exist, add a new one
    localStorage.setItem("updatedTime", "{}");
  } finally {
    return result;
  }
};

export const getChannelUpdatedTime = (channelId: string) => {
  const result = { channel: 0, message: 0 };

  try {
    const data = getLocalStorageUpdatedTime();
    let updatedTime = data[channelId];

    if (updatedTime) {
      if (updatedTime.channel) result.channel = updatedTime.channel;
      if (updatedTime.message) result.message = updatedTime.message;
    }
  } catch {
  } finally {
    return result;
  }
};

export const setChannelUpdatedTime = (
  channelId: string,
  { channel, message }: { channel?: number; message?: number }
) => {
  const localStorageUpdatedTime = getLocalStorageUpdatedTime();
  const channelUpdatedTime = getChannelUpdatedTime(channelId);

  localStorageUpdatedTime[channelId] = {
    channel: channel || channelUpdatedTime.channel,
    message: message || channelUpdatedTime.message,
  };

  // localStorage.setItem("updatedTime", JSON.stringify(localStorageUpdatedTime));
};

export const isSameUpdatedTime = (channelId: string) => {
  const { channel, message } = getChannelUpdatedTime(channelId);
  return !!channel && !!message && channel === message;
};
