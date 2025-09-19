import { useScrollToTop } from "@react-navigation/native";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";

import { ThemedText, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { TalkCard } from "@/components/TalkCard";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { useReactConfStore } from "@/store/reactConfStore";
import { FlatList } from "react-native-gesture-handler";

export default function Bookmarks() {
  const scrollRef = React.useRef<FlatList>(null);
  useScrollToTop(scrollRef);

  const bookmarks = useBookmarkStore((state) => state.bookmarks);

  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);

  const backgroundColor = useThemeColor(theme.color.background);

  const dayOneFiltered = dayOne.filter(
    (session) => !!bookmarks.find((b) => b.sessionId === session.id),
  );

  const dayTwoFiltered = dayTwo.filter(
    (session) => !!bookmarks.find((b) => b.sessionId === session.id),
  );

  return (
    <FlatList
      contentInsetAdjustmentBehavior="automatic"
      ref={scrollRef}
      style={{ backgroundColor }}
      contentContainerStyle={styles.flatListContainer}
      data={[
        ...dayOneFiltered.map((talk) => ({ talk, isDayOne: true })),
        ...dayTwoFiltered.map((talk) => ({ talk, isDayOne: false })),
      ]}
      renderItem={({ item }) => (
        <TalkCard
          key={item.talk.id}
          session={item.talk}
          isDayOne={item.isDayOne}
          isBookmarked={true}
        />
      )}
      ListEmptyComponent={
        <View style={styles.bookmarks}>
          <ThemedText
            fontWeight="bold"
            fontSize={20}
            style={{ marginBottom: theme.space8 }}
          >
            No sessions bookmarked
          </ThemedText>
          <ThemedText fontSize={18}>
            Tap on the bookmark icon on a session to add it to your bookmarks,
            and it will be displayed here.
          </ThemedText>
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  flatListContainer: {
    paddingTop: theme.space16,
    paddingBottom: Platform.select({ android: 100, default: 0 }),
  },
  bookmarks: {
    paddingHorizontal: theme.space24,
  },
});
