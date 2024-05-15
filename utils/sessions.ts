import { ApiAllSessions, Session, Speaker } from "@/types";
// @ts-ignore
import { allTalks } from "@/utils/testData/allSessions";
import { isDayOneSession, isDayTwoSession } from "./formatDate";

export const formatSessions = (talks: ApiAllSessions): Session[][] => {
  const allSessions = talks.sessions.map((talk) => ({
    id: talk.id,
    title: talk.title,
    description: talk.description,
    startsAt: talk.startsAt,
    endsAt: talk.endsAt,
    isServiceSession: talk.isServiceSession,
    speakers: (talk.speakers
      ?.map((speakerId) => talks.speakers.find((sp) => sp.id === speakerId))
      .filter(Boolean) || []) as Speaker[],
    room: talks.rooms.find((room) => room.id === talk.roomId)?.name || "...",
  }));

  const dayOne = allSessions.filter((session) =>
    isDayOneSession(session.startsAt),
  );

  const dayTwo = allSessions.filter((session) =>
    isDayTwoSession(session.startsAt),
  );

  return [dayOne, dayTwo];
};

export const formatSession = (
  talk: ApiAllSessions["sessions"][number],
  talks: typeof allTalks,
): Session => {
  return {
    id: talk.id,
    title: talk.title,
    description: talk.description,
    startsAt: talk.startsAt,
    endsAt: talk.endsAt,
    isServiceSession: talk.isServiceSession,
    speakers: (talk.speakers
      // @ts-ignore
      ?.map((speakerId) => talks.speakers.find((sp) => sp.id === speakerId))
      .filter(Boolean) || []) as Speaker[],
    // @ts-ignore
    room: talks.rooms.find((room) => room.id === talk.roomId)?.name || "...",
  };
};
