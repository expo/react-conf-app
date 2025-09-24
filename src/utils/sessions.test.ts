import { formatSession } from "./sessions";

import { allSessions } from "@/utils/testData/allSessions";

describe(formatSession, () => {
  // no non-talks yet in the new version
  // it("formats non-talk correctly", () => {
  //   const session = {
  //     id: "2e115a1f-803c-4c38-a0c9-a0c809457d51",
  //     title: "Registration",
  //     description: null,
  //     startsAt: "2024-05-15T01:00:00Z",
  //     endsAt: "2024-05-15T04:00:00Z",
  //     isServiceSession: true,
  //     isPlenumSession: false,
  //     speakers: [],
  //     categoryItems: [],
  //     questionAnswers: [],
  //     roomId: 45058,
  //     liveUrl: null,
  //     recordingUrl: null,
  //     status: null,
  //     isInformed: false,
  //     isConfirmed: false,
  //   };

  //   expect(formatSession(session, allSessions)).toEqual({
  //     id: "2e115a1f-803c-4c38-a0c9-a0c809457d51",
  //     title: "Registration",
  //     description: null,
  //     startsAt: "2024-05-15T01:00:00Z",
  //     endsAt: "2024-05-15T04:00:00Z",
  //     isServiceSession: true,
  //     room: "Lobby Hallway",
  //     speakers: [],
  //   });
  // });

  it("formats a talk correcly", () => {
    const session = {
      id: "987074",
      title: "The React Router take on RSC",
      description:
        "A lightning talk where Kent shows how React Router is embracing React Server Components to simplify its architecture, unlock new patterns for data loading, streaming, and code splitting, and make building full-stack React apps faster and more seamless.",
      startsAt: "2025-10-08T15:15:00",
      endsAt: "2025-10-08T15:30:00",
      isServiceSession: false,
      isPlenumSession: false,
      speakers: ["75da261e-612c-4869-a111-3475bffb99f0"],
      categoryItems: [],
      questionAnswers: [
        {
          questionId: 99885,
          answerValue:
            "React Server Components have changed how we think about building React applications. In this lightning talk, Kent will explore how React Router is embracing RSC and what this means for the future of routing in React applications. This talk will dive into how RSC has simplified React Router's architecture and enables powerful new patterns for data loading, streaming, and code splitting.\r\n\r\nWe'll see how React Router has evolved to work seamlessly with React Server Components, making it easier than ever to build full-stack React applications with excellent performance and developer experience.",
        },
      ],
      roomId: 71511,
      liveUrl: null,
      recordingUrl: null,
      status: "Accepted",
      isInformed: true,
      isConfirmed: true,
    };
    expect(formatSession(session, allSessions)).toEqual({
      description:
        "A lightning talk where Kent shows how React Router is embracing React Server Components to simplify its architecture, unlock new patterns for data loading, streaming, and code splitting, and make building full-stack React apps faster and more seamless.",
      endsAt: "2025-10-08T15:30:00",
      id: "987074",
      isServiceSession: false,
      room: "Casablanca Ballroom ",
      speakers: [
        {
          id: "75da261e-612c-4869-a111-3475bffb99f0",
          firstName: "Kent C.",
          lastName: "Dodds",
          bio: "Kent C. Dodds is a world renowned web development educator and engineer. He's actively involved in the open source community. He is the creator of EpicWeb.dev, EpicAI.pro, the Epic Stack, EpicReact.dev, and TestingJavaScript.com. He's a Microsoft MVP, instructor on egghead.io and Frontend Masters, live streamer, and podcaster. Kent is married and the father of five kids and he lives in Utah.",
          tagLine: "Software Engineer Educator",
          profilePicture:
            "https://sessionize.com/image/c4e3-400o400o1-BMT43t5kd2U1XstaNnM6Ax.jpg",
          isTopSpeaker: false,
          links: [
            {
              title: "X (Twitter)",
              url: "https://x.com/kentcdodds",
              linkType: "Twitter",
            },
            {
              title: "LinkedIn",
              url: "https://www.linkedin.com/in/kentcdodds/",
              linkType: "LinkedIn",
            },
            {
              title: "Blog",
              url: "https://kentcdodds.com/blog",
              linkType: "Blog",
            },
            {
              title: "Company Website",
              url: "https://kentcdodds.com",
              linkType: "Company_Website",
            },
            {
              title: "Talks",
              url: "https://kentcdodds.com/talks",
              linkType: "Other",
            },
            {
              title: "Sessionize",
              url: "https://sessionize.com/kentcdodds",
              linkType: "Sessionize",
            },
          ],
          sessions: [987054, 987074, 947075],
          fullName: "Kent C. Dodds",
          categoryItems: [],
          questionAnswers: [
            {
              questionId: 99886,
              answerValue: "https://github.com/kentcdodds",
            },
            {
              questionId: 99887,
              answerValue: "EpicReact.dev",
            },
            {
              questionId: 99888,
              answerValue: "https://x.com/kentcdodds",
            },
          ],
        },
      ],
      startsAt: "2025-10-08T15:15:00",
      title: "The React Router take on RSC",
    });
  });
});
