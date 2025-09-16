import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Bookmark } from "./Bookmark";
import { SpeakerImage } from "./SpeakerImage";
import { ThemedText, ThemedView } from "./Themed";
import { theme } from "../theme";
import { Session, Speaker } from "../types";
import { formatSessionTime } from "../utils/formatDate";

import { useReactConfStore } from "@/store/reactConfStore";
import { Pressable } from "react-native-gesture-handler";

type Props = {
  session: Session;
  isDayOne: boolean;
};

export function TalkCard({ session, isDayOne }: Props) {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);

  return (
    <Link
      push
      href={{
        pathname: "/talk/[talk]",
        params: { talk: session.id },
      }}
      asChild
    >
      <Pressable>
        <ThemedView style={styles.container}>
          <ThemedText
            fontSize={14}
            fontWeight="medium"
            color={theme.color.textSecondary}
            marginBottom={theme.space8}
          >
            {formatSessionTime(session, shouldUseLocalTz)}
          </ThemedText>
          <ThemedView
            color={theme.color.backgroundSecondary}
            style={styles.content}
          >
            <View style={styles.titleAndBookmark}>
              <ThemedText
                fontSize={18}
                fontWeight="semiBold"
                style={{ flex: 1 }}
              >
                {session.title}
              </ThemedText>
              <Bookmark session={session} />
            </View>
            {session.speakers.map((speaker) => (
              <SpeakerDetails speaker={speaker} key={speaker.id} />
            ))}
          </ThemedView>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

function SpeakerDetails({ speaker }: { speaker: Speaker }) {
  return (
    <View style={styles.speaker}>
      <SpeakerImage
        profilePicture={speaker.profilePicture}
        animated
        size="small"
      />
      <View style={styles.speakerDetails}>
        <ThemedText fontSize={16} fontWeight="semiBold">
          {speaker.fullName}
        </ThemedText>
        <ThemedText
          fontSize={16}
          fontWeight="medium"
          color={theme.color.textSecondary}
        >
          {speaker.tagLine}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.space24,
    marginBottom: theme.space16,
    borderRadius: theme.borderRadius10,
  },
  content: {
    borderRadius: theme.borderRadius10,
    padding: theme.space24,
    gap: theme.space24,
  },
  speaker: {
    flexDirection: "row",
    alignItems: "center",
  },
  speakerDetails: {
    flex: 1,
    justifyContent: "center",
  },
  titleAndBookmark: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
