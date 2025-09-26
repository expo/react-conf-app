import { useRouter } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Bookmark } from "./Bookmark";
import { ThemedText, ThemedView, useThemeColor } from "./Themed";
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
  const borderColor = useThemeColor(theme.color.border);
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
    <Pressable onPress={handlePress}>
      <ThemedView style={styles.container}>
        {!isBookmarked && (
          <ThemedText
            fontSize={18}
            fontWeight="medium"
            color={theme.color.textSecondary}
            marginBottom={theme.space8}
            style={{ textAlign: "center" }}
          >
            {formatSessionTime(session, shouldUseLocalTz)}
          </ThemedText>
        )}
        <ThemedView
          color={theme.color.backgroundSecondary}
          style={styles.content}
        >
          <View style={styles.titleAndBookmark}>
            <ThemedText fontSize={18} fontWeight="semiBold" style={{ flex: 1 }}>
              {session.title}
            </ThemedText>
            <Bookmark session={session} size="small" />
          </View>
          {isBookmarked && (
            <View style={[styles.time, { borderColor }]}>
              <ThemedText fontSize={14} fontWeight="medium">
                {formatSessionTime(session, shouldUseLocalTz)}
              </ThemedText>
              <ThemedText fontSize={14} fontWeight="medium">
                {day === ConferenceDay.One ? "Day 1" : "Day 2"}
              </ThemedText>
            </View>
          )}
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
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.space24,
    marginBottom: theme.space16,
    borderRadius: theme.borderRadius10,
  },
  content: {
    borderRadius: theme.borderRadius32,
    padding: theme.space24,
    gap: theme.space24,
  },
  titleAndBookmark: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: theme.space8,
  },
  time: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: theme.space16,
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
