export type CacheLatestModifyType = Record<string, Record<string, number>>;

const getLocalStorageLatestModify = () => {
  let result: CacheLatestModifyType = {};
  try {
    const dataString = localStorage.getItem("latestModifies") || "";
    const data = JSON.parse(dataString);
    result = data;
  } catch {
    // when [latestModifies] did not exist, add a new one
    localStorage.setItem("latestModifies", "{}");
  } finally {
    return result;
  }
};

export const getChannelLatestModify = (channelId: string) => {
  const result = { channel: 0, message: 0 };

  try {
    const data = getLocalStorageLatestModify();
    let latestModify = data[channelId];

    if (latestModify) {
      if (latestModify.channel) result.channel = latestModify.channel;
      if (latestModify.message) result.message = latestModify.message;
    }
  } catch {
  } finally {
    return result;
  }
};

export const setChannelLatestModify = (
  channelId: string,
  { channel, message }: { channel?: number; message?: number }
) => {
  const localStorageLatestModify = getLocalStorageLatestModify();
  const channelLatestModify = getChannelLatestModify(channelId);

  localStorageLatestModify[channelId] = {
    channel: channel || channelLatestModify.channel,
    message: message || channelLatestModify.message,
  };

  localStorage.setItem("latestModifies", JSON.stringify(localStorageLatestModify));
};

export const isSameLatestModify = (channelId: string) => {
  const { channel, message } = getChannelLatestModify(channelId);
  return !!channel && !!message && channel === message;
};
