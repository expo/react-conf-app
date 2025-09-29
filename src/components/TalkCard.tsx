import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Bookmark } from "./Bookmark";
import { ThemedText, ThemedView } from "./Themed";
import { theme } from "../theme";
import { Session, Speaker } from "@/types";
import { formatSessionTime } from "../utils/formatDate";

import { useReactConfStore } from "@/store/reactConfStore";
import { Pressable } from "react-native-gesture-handler";
import { SpeakerDetails } from "./SpeakerDetails";
import { ConferenceDay } from "@/consts";
import * as Haptics from "expo-haptics";

type Props = {
  session: Session;
  day: ConferenceDay;
  isBookmarked?: boolean;
};

export function TalkCard({ session, day, isBookmarked = false }: Props) {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);
  const router = useRouter();

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    router.push({
      pathname: "/talk/[talk]",
      params: { talk: session.id },
    });
  };

  const handleSpeakerPress = (speaker: Speaker) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    router.push({
      pathname: "/speaker/[speaker]",
      params: { speaker: speaker.id },
    });
  };

  return (
    <ThemedView style={styles.container}>
      {!isBookmarked && (
        <ThemedText
          fontSize={theme.fontSize18}
          fontWeight="medium"
          color={theme.color.textSecondary}
          marginBottom={theme.space8}
          style={{ marginLeft: theme.space24 }}
        >
          {formatSessionTime(session, shouldUseLocalTz)}
        </ThemedText>
      )}
      <ThemedView
        color={theme.color.backgroundSecondary}
        style={styles.content}
      >
        <Pressable
          onPress={handlePress}
          style={{
            marginHorizontal: -theme.space16,
            paddingHorizontal: theme.space16,
            marginVertical: -theme.space8,
            paddingVertical: theme.space8,
          }}
        >
          <View style={styles.titleAndBookmark}>
            <ThemedText
              fontSize={theme.fontSize18}
              fontWeight="semiBold"
              style={styles.flex1}
            >
              {session.title}
            </ThemedText>
            <Bookmark session={session} size="small" />
          </View>
          {isBookmarked && (
            <ThemedView
              style={styles.time}
              color={{
                dark: "#3b3a3a",
                light: "#dedede",
              }}
            >
              <ThemedText fontSize={theme.fontSize14} fontWeight="medium">
                {formatSessionTime(session, shouldUseLocalTz)}
              </ThemedText>
              <ThemedText fontSize={theme.fontSize14} fontWeight="medium">
                {day === ConferenceDay.One ? "Day 1" : "Day 2"}
              </ThemedText>
            </ThemedView>
          )}
        </Pressable>
        {session.speakers.map((speaker) => (
          <Pressable
            onPress={() => handleSpeakerPress(speaker)}
            key={speaker.id}
            style={({ pressed }) => ({
              marginHorizontal: -theme.space16,
              paddingHorizontal: theme.space16,
              marginVertical: -theme.space8,
              paddingVertical: theme.space8,
              borderRadius: theme.borderRadius32,
              opacity: pressed ? 0.6 : 1,
            })}
          >
            <SpeakerDetails speaker={speaker} key={speaker.id} />
          </Pressable>
        ))}
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: theme.borderRadius10,
    marginBottom: theme.space16,
    marginHorizontal: theme.space16,
  },
  content: {
    borderRadius: theme.borderRadius32,
    gap: theme.space24,
    padding: theme.space24,
  },
  flex1: {
    flex: 1,
  },
  time: {
    borderRadius: theme.borderRadius10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: theme.space16,
    paddingVertical: theme.space16,
  },
  titleAndBookmark: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.space8,
    justifyContent: "space-between",
    marginBottom: theme.space16,
  },
});
