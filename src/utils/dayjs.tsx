import dayjs from "dayjs";
import advancedFormat from "dayjs/plugin/advancedFormat";
dayjs.extend(advancedFormat);

export const isToday = (time: number) => {
  return dayjs(time).diff(new Date(), "day") === 0;
};
export const isSameDay = (time1: number, time2: number) => {
  return dayjs(time1).diff(dayjs(time2), "day") === 0;
};

export const minuteDiff = (time1: number, time2: number) => {
  return dayjs(time1).diff(dayjs(time2), "minute");
};
export const dayDiff = (time1: number, time2: number) => {
  return dayjs(time1).diff(dayjs(time2), "day");
};

const dayFormat = (time: number, format: string) => dayjs(time).format(format);
dayFormat.time = (time: number) => dayjs(time).format("h:mm");
dayFormat.timeA = (time: number) => dayjs(time).format("h:mm A");
dayFormat.day = (time: number) => dayjs(time).format("MMM DD");

export { dayFormat };
