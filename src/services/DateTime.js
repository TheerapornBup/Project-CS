import moment from "moment/moment";

export function convertTimestampToDate(seconds) {
  return Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(seconds * 1000);
}
export function convertTimestampToDDMMYY(seconds) {
  return Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  }).format(seconds * 1000);
}
export function convertTimestampToTime(seconds) {
  return Intl.DateTimeFormat("th-TH", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(seconds * 1000);
}

export function isToday(date) {
  // const date = new Date(seconds * 1000); // if parameter is seconds
  const today = new Date();

  if (today.toDateString() === date.toDateString()) {
    return true;
  }
  return false;
}

export function isYesterday(date) {
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  if (yesterday.toDateString() === date.toDateString()) {
    return true;
  }
  return false;
}

export function diffDate(seconds) {
  const start = moment(seconds * 1000);
  const now = moment();
  const diff = now.diff(start, "days");

  return diff;
}

export function diffMilliseconds(dateTime1, dateTime2) {
  const start = moment(dateTime1);
  const end = moment(dateTime2 * 1000);
  const diff = end.diff(start);

  return Math.abs(diff);
}
