import { formatSession } from "./sessions";

import { allSessions } from "@/utils/testData/allSessions";

describe(formatSession, () => {
  it("formats non-talk correctly", () => {
    const session = {
      id: "2e115a1f-803c-4c38-a0c9-a0c809457d51",
      title: "Registration",
      description: null,
      startsAt: "2024-05-15T01:00:00Z",
      endsAt: "2024-05-15T04:00:00Z",
      isServiceSession: true,
      isPlenumSession: false,
      speakers: [],
      categoryItems: [],
      questionAnswers: [],
      roomId: 45058,
      liveUrl: null,
      recordingUrl: null,
      status: null,
      isInformed: false,
      isConfirmed: false,
    };

    expect(formatSession(session, allSessions)).toEqual({
      id: "2e115a1f-803c-4c38-a0c9-a0c809457d51",
      title: "Registration",
      description: null,
      startsAt: "2024-05-15T01:00:00Z",
      endsAt: "2024-05-15T04:00:00Z",
      isServiceSession: true,
      room: "Lobby Hallway",
      speakers: [],
    });
  });

  it("formats a talk correcly", () => {
    const session = {
      id: "665505",
      title: "Vanilla React",
      description:
        "In 2014 Ryan and Michael first published React Router. Over the past decade, React Router has been the backbone of countless React apps, and has provided a stable foundation for anyone building with React. More recently, React Router has grown into a full stack framework with some help from Remix and Shopify. This talk will explore what we've done to keep React Router up to date as React evolves, and show off some of the latest developments we've been working on.",
      startsAt: "2024-05-15T17:15:00Z",
      endsAt: "2024-05-15T17:35:00Z",
      isServiceSession: false,
      isPlenumSession: false,
      speakers: ["e3e97117-b273-4cff-9c59-388b21a4b5b7"],
      categoryItems: [],
      questionAnswers: [],
      roomId: 45056,
      liveUrl: null,
      recordingUrl: null,
      status: "Accepted",
      isInformed: true,
      isConfirmed: false,
    };
    expect(formatSession(session, allSessions)).toEqual({
      description:
        "In 2014 Ryan and Michael first published React Router. Over the past decade, React Router has been the backbone of countless React apps, and has provided a stable foundation for anyone building with React. More recently, React Router has grown into a full stack framework with some help from Remix and Shopify. This talk will explore what we've done to keep React Router up to date as React evolves, and show off some of the latest developments we've been working on.",
      endsAt: "2024-05-15T17:35:00Z",
      id: "665505",
      isServiceSession: false,
      room: "Casablanca South",
      speakers: [
        {
          bio: "Obsessed with UX since using an Intellivision.",
          categoryItems: [],
          firstName: "Ryan",
          fullName: "Ryan Florence",
          id: "e3e97117-b273-4cff-9c59-388b21a4b5b7",
          isTopSpeaker: false,
          lastName: "Florence",
          links: [
            {
              linkType: "Twitter",
              title: "Twitter",
              url: "https://twitter.com/ryanflorence",
            },
            {
              linkType: "Blog",
              title: "Blog",
              url: "https://ryanflorence.com",
            },
            {
              linkType: "Company_Website",
              title: "Company Website",
              url: "https://remix.run",
            },
          ],
          profilePicture:
            "https://sessionize.com/image/8295-400o400o1-96d9fe36-2eb4-43ed-8f63-83765aa47767.jpg",
          questionAnswers: [
            {
              answerValue: "ryanflorence",
              questionId: 70280,
            },
          ],
          sessions: [665505],
          tagLine: "Co-creator of Remix",
        },
      ],
      startsAt: "2024-05-15T17:15:00Z",
      title: "Vanilla React",
    });
  });
});
