export function convertTimestampToDate(seconds) {
  return Intl.DateTimeFormat("th-TH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
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
