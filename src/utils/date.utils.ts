import { FrequencyEnum } from "@/src/enums/common.enums";

export const isValidDate = (dateToValidate: string | Date) =>
  !isNaN(new Date(dateToValidate) as unknown as number);

export const timestampToDate = (timestamp: any) => {
  try {
    return new Date(
      // @ts-ignore
      (timestamp.seconds || timestamp["_seconds"]) * 1000 +
        // @ts-ignore
        (timestamp.nanoseconds || timestamp["_nanoseconds"]) / 1000000
    );
  } catch (error) {
    console.error("transformTimestamp error:", error);
  }
};

export const dateDisplay = (
  dateToDisplay: string | Date,
  format = "locale"
): string => {
  const date = isValidDate(dateToDisplay as unknown as string)
    ? new Date(dateToDisplay as unknown as string)
    : timestampToDate(dateToDisplay);
  switch (format) {
    case "locale":
    default:
      return date?.toLocaleString() as string;
    case "date":
      return date?.toLocaleDateString() as unknown as string;
    case "dateType":
      return date as unknown as string;
    case "dateTime":
      return date
        ? new Intl.DateTimeFormat("it-IT", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          }).format(date)
        : "";
    case "time":
      // Show only hours and minutes
      return date
        ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
        : "";
    case "monthYearLiteral":
      // Show month and year in a more readable format
      return date
        ? new Intl.DateTimeFormat("it-IT", {
            year: "numeric",
            month: "long",
          }).format(date)
        : "";
  }
};

export const dateDiff = (
  firstDate = new Date(),
  secondDate = new Date(),
  unit = FrequencyEnum.MINUTES
) => {
  let divider = 1000;
  switch (unit) {
    case FrequencyEnum.SECONDS:
      divider = divider;
      break;
    case FrequencyEnum.MINUTES:
    default:
      divider = divider * 60;
      break;
    case FrequencyEnum.HOURS:
      divider = divider * 60 * 60;
      break;
    case FrequencyEnum.DAYS:
      divider = divider * 60 * 60 * 24;
      break;
  }
  return Math.round(
    (new Date(firstDate).getTime() - new Date(secondDate).getTime()) / divider
  );
};

export const isDateInRange = (
  from: Date,
  to: Date,
  dateToCheck: Date = new Date()
) => {
  let fDate, lDate, cDate;
  fDate = from.getTime();
  lDate = to.getTime();
  cDate = dateToCheck.getTime();
  return cDate <= lDate && cDate >= fDate;
};

export const getPostgresTimestamp = (date = new Date()) => {
  const pad = (num: number, size: number) => num.toString().padStart(size, "0");

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1, 2);
  const day = pad(date.getDate(), 2);
  const hours = pad(date.getHours(), 2);
  const minutes = pad(date.getMinutes(), 2);
  const seconds = pad(date.getSeconds(), 2);
  const milliseconds = pad(date.getMilliseconds(), 6);

  const offsetMinutes = date.getTimezoneOffset();
  const sign = offsetMinutes > 0 ? "-" : "+";
  const offsetHours = pad(Math.floor(Math.abs(offsetMinutes) / 60), 2);
  const offsetMins = pad(Math.abs(offsetMinutes) % 60, 2);
  const timezone = `${sign}${offsetHours}:${offsetMins}`;

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${timezone}`;
};
