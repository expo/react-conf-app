import { formatDate } from "date-fns";
import { formatInTimeZone } from "date-fns-tz";

import { Session } from "../types";

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

export const isDayOneSession = (date: string) => {
  try {
    return (
      formatInTimeZone(new Date(date), "America/Los_Angeles", `LLL d, yyyy`) ===
      "May 15, 2024"
    );
  } catch {
    return false;
  }
};

export const isDayTwoSession = (date: string) => {
  try {
    return (
      formatInTimeZone(new Date(date), "America/Los_Angeles", `LLL d, yyyy`) ===
      "May 16, 2024"
    );
  } catch {
    return false;
  }
};
