import { platformSortName } from "./constants";

export const detectPlatform = () => {
  const { platform } = navigator;
  return {
    isMac: !!/Mac/i.test(platform),
    isIos: !!/(iPhone|iPod|iPad)/i.test(platform),
    isWindow: !!/Win/i.test(platform),
    isAndroid: !!/android/i.test(platform),
  };
};

export const getPlatform = () => {
  const { platform } = navigator;
  if (/Mac/i.test(platform)) return platformSortName.MAC;
  if (/(iPhone|iPod|iPad)/i.test(platform)) return platformSortName.IOS;
  if (/Win/i.test(platform)) return platformSortName.WINDOW;
  if (/android/i.test(platform)) return platformSortName.ANDROID;
};
