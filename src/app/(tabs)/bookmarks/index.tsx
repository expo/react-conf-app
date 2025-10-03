import React, { useCallback } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";

import { ThemedText, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { TalkCard } from "@/components/TalkCard";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { useReactConfStore } from "@/store/reactConfStore";
import { Session } from "@/types";
import { ConferenceDay } from "@/consts";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";
import { Link } from "expo-router";

export default function Bookmarks() {
  const bookmarks = useBookmarkStore((state) => state.bookmarks);

  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);

  const backgroundColor = useThemeColor(theme.color.background);

  const dayOneFiltered = dayOne.filter(
    (session) => !!bookmarks.find((b) => b.sessionId === session.id),
  );

  const dayTwoFiltered = dayTwo.filter(
    (session) => !!bookmarks.find((b) => b.sessionId === session.id),
  );

  const renderItem = useCallback(
    ({ item }: { item: { talk: Session; day: ConferenceDay } }) => (
      <Animated.View key={item.talk.id} entering={FadeIn} exiting={FadeOut}>
        <TalkCard session={item.talk} day={item.day} isBookmarked={true} />
      </Animated.View>
    ),
    [],
  );

  return (
    <Animated.FlatList
      contentInsetAdjustmentBehavior="automatic"
      style={{ backgroundColor }}
      contentContainerStyle={styles.flatListContainer}
      data={[
        ...dayOneFiltered.map((talk) => ({ talk, day: ConferenceDay.One })),
        ...dayTwoFiltered.map((talk) => ({ talk, day: ConferenceDay.Two })),
      ]}
      renderItem={renderItem}
      keyExtractor={(item) => item.talk.id}
      itemLayoutAnimation={LinearTransition}
      ListEmptyComponent={
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <View style={styles.bookmarks}>
            <ThemedText fontWeight="bold" fontSize={theme.fontSize20}>
              No sessions bookmarked
            </ThemedText>
            <ThemedText
              fontSize={theme.fontSize18}
              color={theme.color.textSecondary}
            >
              Tap on the bookmark icon on a session to add it to your bookmarks,
              and it will be displayed here.
            </ThemedText>
            <Link href="/(tabs)/(calendar)" asChild>
              <Pressable>
                <ThemedText
                  color={theme.color.reactBlue}
                  style={{ marginTop: theme.space2 }}
                >
                  View all sessions
                </ThemedText>
              </Pressable>
            </Link>
          </View>
        </Animated.View>
      }
    />
  );
}

const styles = StyleSheet.create({
  bookmarks: {
    gap: theme.space16,
    paddingHorizontal: theme.space16,
  },
  flatListContainer: {
    paddingBottom: Platform.select({ android: 100, default: 0 }),
    paddingTop: theme.space16,
  },
});
