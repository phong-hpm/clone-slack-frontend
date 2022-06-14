import {
  dayFormat,
  isSameDay,
  isToday,
  minuteDiff,
  minuteDiffAbs,
  dayDiff,
  dayFromNow,
} from "utils/dayjs";

const today = new Date("11/11/2022").getTime();
const tomorrow = new Date("11/12/2022").getTime();

test("isToday", () => {
  expect(isToday(tomorrow)).toBeFalsy();
  expect(isToday(Date.now())).toBeTruthy();
});

test("isSameDay", () => {
  expect(isSameDay(today, tomorrow)).toBeFalsy();
  expect(isSameDay(today, today)).toBeTruthy();
});

test("minuteDiff", () => {
  expect(minuteDiff(today, tomorrow)).toEqual(-1440);
  expect(minuteDiff(today, today)).toEqual(0);
});

test("minuteDiffAbs", () => {
  expect(minuteDiffAbs(today, tomorrow)).toEqual(1440);
  expect(minuteDiffAbs(today, today)).toEqual(0);
});

test("dayDiff", () => {
  expect(dayDiff(today, tomorrow)).toEqual(-1);
  expect(dayDiff(today, today)).toEqual(0);
});

test("dayFromNow", () => {
  let monthAgo = new Date();
  monthAgo.setMonth(monthAgo.getMonth() - 1);

  expect(dayFromNow(monthAgo.getTime())).toEqual("a month ago");
});

test("formatDay", () => {
  expect(dayFormat(today, "HH:mm")).toEqual("00:00");

  expect(dayFormat.time(today)).toEqual("12:00");

  expect(dayFormat.timeA(today)).toEqual("12:00 AM");

  expect(dayFormat.fullTimeA(today)).toEqual("12:00:00 AM");

  expect(dayFormat.day(today)).toEqual("Nov 11");

  expect(dayFormat.fullDay(today)).toEqual("Nov 11, 2022");

  expect(dayFormat.dayO(today)).toEqual("Nov 11th");
});
