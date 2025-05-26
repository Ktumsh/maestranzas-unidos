import { format } from "date-fns";
import { es } from "date-fns/locale";
import { formatInTimeZone, toZonedTime } from "date-fns-tz";

export const formatToCapitalize = (word: string) => {
  return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
};

export const formatDate = (
  input: Date | string,
  formatStr: string = "dd/MM/yyyy",
): string => {
  const date = new Date(input);

  if (isNaN(date.getTime())) {
    throw new Error("Fecha inválida proporcionada.");
  }

  const formattedDate = format(date, formatStr, { locale: es });
  return formattedDate;
};

export const formatDateWithAutoTimezone = (
  input: Date,
  formatStr: string = "d MMM. yyyy HH:mm:ss",
): string => {
  const date = new Date(input);

  if (isNaN(date.getTime())) {
    throw new Error("Fecha inválida proporcionada.");
  }

  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  const zonedDate = toZonedTime(date, timeZone);

  const regionName =
    new Intl.DateTimeFormat("es", {
      timeZoneName: "long",
      timeZone,
    })
      .formatToParts(zonedDate)
      .find((part) => part.type === "timeZoneName")?.value || timeZone;

  const formattedDate = format(zonedDate, formatStr, { locale: es });

  return `${formattedDate} (${regionName})`;
};

export const formatDateInTimezone = (date: Date, formatStr: string) => {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return formatInTimeZone(date, userTimeZone, formatStr, { locale: es });
};
