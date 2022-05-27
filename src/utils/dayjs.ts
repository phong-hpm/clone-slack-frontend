import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(advancedFormat);
dayjs.extend(relativeTime);

export const isToday = (time: number) => {
  return dayjs(time).diff(new Date(), "day") === 0;
};
export const isSameDay = (time1: number, time2: number) => {
  return dayjs(time1).diff(dayjs(time2), "day") === 0;
};

export const minuteDiff = (time1: number, time2: number) => {
  return dayjs(time1).diff(dayjs(time2), "minute");
};
export const minuteDiffAbs = (time1: number, time2: number) => {
  return Math.abs(minuteDiff(time1, time2));
};
export const dayDiff = (time1: number, time2: number) => {
  return dayjs(time1).diff(dayjs(time2), "day");
};

export const dayFromNow = (time: number) => dayjs(time).fromNow();

const dayFormat = (time: number, format: string) => dayjs(time).format(format);
dayFormat.time = (time: number) => dayjs(time).format("h:mm");
dayFormat.timeA = (time: number) => dayjs(time).format("h:mm A");
dayFormat.fullTimeA = (time: number) => dayjs(time).format("h:mm:ss A");
dayFormat.day = (time: number) => dayjs(time).format("MMM DD");
dayFormat.dayO = (time: number) => dayjs(time).format("MMM Do");

export { dayFormat };
