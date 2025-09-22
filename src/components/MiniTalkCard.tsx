import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";

import { ThemedText, ThemedView, useThemeColor } from "./Themed";

import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { formatSessionTime } from "@/utils/formatDate";
import { Bookmark } from "./Bookmark";

export function MiniTalkCard({ sessionId }: { sessionId: string | number }) {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);
  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);
  const backgroundColor = useThemeColor(theme.color.backgroundSecondary);
  const textSecondaryColor = useThemeColor(theme.color.textSecondary);

  const { talk, isDayOne } = (() => {
    const dayOneTalk = dayOne.find(
      (session) => session.id === String(sessionId),
    );
    if (dayOneTalk) {
      return { talk: dayOneTalk, isDayOne: true };
    }
    const dayTwoTalk = dayTwo.find(
      (session) => session.id === String(sessionId),
    );
    if (dayTwoTalk) {
      return { talk: dayTwoTalk, isDayOne: false };
    }
    return { talk: null, isDayOne: null };
  })();

  if (!talk) {
    return null;
  }

  return (
    <Link
      push
      href={{
        pathname: "/talk/[speaker]",
        params: { speaker: talk.id },
      }}
      asChild
    >
      <Pressable>
        <ThemedView style={[styles.container, { backgroundColor }]}>
          <View>
            <ThemedText fontSize={theme.fontSize16} fontWeight="semiBold">
              {talk.title}
            </ThemedText>
            <ThemedText
              fontSize={theme.fontSize14}
              fontWeight="medium"
              color={{ light: textSecondaryColor, dark: textSecondaryColor }}
              style={{ marginBottom: theme.space8 }}
            >
              {formatSessionTime(talk, shouldUseLocalTz)}
              {` `}({isDayOne ? "Day 1" : "Day 2"})
            </ThemedText>
          </View>
          <Bookmark session={talk} />
        </ThemedView>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: theme.borderRadius10,
    padding: theme.space24,
    marginBottom: theme.space24,
  },
});
