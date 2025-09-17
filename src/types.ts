import { allSessions } from "@/utils/testData/allSessions";

export type Session = {
  id: string;
  title: string;
  description: string | null;
  startsAt: string;
  endsAt: string;
  speakers: Speaker[];
  room: string;
  isServiceSession: boolean;
};

export type Speaker = {
  id: string;
  firstName: string;
  lastName: string;
  bio: string | null;
  tagLine: string | null;
  profilePicture: string | null;
  links: { title: string; url: string; linkType: string }[];
  sessions: number[];
  fullName: string;
  categoryItems: number[];
};

export type ApiAllSessions = typeof allSessions;

export type ApiSpeaker = (typeof allSessions)["speakers"][number];
