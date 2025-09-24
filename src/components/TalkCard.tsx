import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Bookmark } from "./Bookmark";
import { ThemedText, ThemedView, useThemeColor } from "./Themed";
import { theme } from "../theme";
import { Session } from "@/types";
import { formatSessionTime } from "../utils/formatDate";

import { useReactConfStore } from "@/store/reactConfStore";
import { Pressable } from "react-native-gesture-handler";
import { SpeakerDetails } from "./SpeakerDetails";
import { ConferenceDay } from "@/consts";

type Props = {
  session: Session;
  day: ConferenceDay;
  isBookmarked?: boolean;
};

export function TalkCard({ session, day, isBookmarked = false }: Props) {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);
  const borderColor = useThemeColor(theme.color.border);

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
          {!isBookmarked && (
            <ThemedText
              fontSize={14}
              fontWeight="medium"
              color={theme.color.textSecondary}
              marginBottom={theme.space8}
            >
              {formatSessionTime(session, shouldUseLocalTz)}
            </ThemedText>
          )}
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
              <SpeakerDetails speaker={speaker} key={speaker.id} />
            ))}
          </ThemedView>
        </ThemedView>
      </Pressable>
    </Link>
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
  },
  time: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    paddingVertical: theme.space16,
    justifyContent: "space-between",
    flexDirection: "row",
  },
});
