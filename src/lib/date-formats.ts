import dayjs from "dayjs";

export const formatDateTime = (date: string | Date) => {
  const now = dayjs();
  const messageDate = dayjs(date);
  const diffSeconds = now.diff(messageDate, "second");
  const diffHours = now.diff(messageDate, "hour");
  const diffDays = now.diff(messageDate, "day");
  const diffYears = now.diff(messageDate, "year");

  if (diffSeconds < 30) return "just now"; // within 30 seconds
  if (diffHours < 24) return messageDate.format("hh:mm A"); // after 30 seconds, show time
  if (diffYears < 1) return messageDate.format("MMM DD hh:mm A"); // same year
  return messageDate.format("MMM DD YYYY hh:mm A"); // older than a year
};

export const formatDateTimeTable = (date: string | Date) => {
  return dayjs(date).format("MMM DD, YYYY - h:mm A");
};
