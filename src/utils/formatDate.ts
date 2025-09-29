import { formatDate } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import { Session } from "@/types";
import { ConferenceDay } from "@/consts";

const timeFormat = "h:mm aaa";
const dateTimeFormat = `${timeFormat}, LLL d`;
const fullDateFormat = `${timeFormat}, LLL d, yyyy`;

export const formatSessionTime = (
  session: Session,
  shouldUseLocalTz: boolean,
) => {
  try {
    const startsAtDate = new Date(session.startsAt);
    const endsAtDate = new Date(session.endsAt);

    if (shouldUseLocalTz) {
      return `${formatDate(startsAtDate, dateTimeFormat)} - ${formatDate(endsAtDate, dateTimeFormat)}`;
    } else {
      return `${formatInTimeZone(startsAtDate, "America/Los_Angeles", timeFormat)} - ${formatInTimeZone(endsAtDate, "America/Los_Angeles", timeFormat)}`;
    }
  } catch {
    return "...";
  }
};

export const formatFullDate = (dateString: string) => {
  try {
    return formatDate(new Date(dateString), fullDateFormat);
  } catch {
    return "...";
  }
};

export const getCurrentTimezone = () => {
  try {
    return formatDate(new Date(), "zzzz");
  } catch {
    return "...";
  }
};

export const DAY_ONE_DATE = "Oct 7, 2025";
export const DAY_TWO_DATE = "Oct 8, 2025";

export const isDayOneSession = (date: string) => {
  try {
    return (
      formatInTimeZone(new Date(date), "America/Los_Angeles", `LLL d, yyyy`) ===
      DAY_ONE_DATE
    );
  } catch {
    return false;
  }
};

export const isDayTwoSession = (date: string) => {
  try {
    return (
      formatInTimeZone(new Date(date), "America/Los_Angeles", `LLL d, yyyy`) ===
      DAY_TWO_DATE
    );
  } catch {
    return false;
  }
};

export const getInitialDay = () => {
  const isDayTwo =
    formatInTimeZone(new Date(), "America/Los_Angeles", `LLL d, yyyy`) ===
    DAY_TWO_DATE;

  return isDayTwo ? ConferenceDay.Two : ConferenceDay.One;
};
