import { useScrollToTop } from "@react-navigation/native";
import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText, ThemedView } from "@/components/Themed";
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

  const dayOneFiltered = dayOne.filter(
    (session) => !!bookmarks.find((b) => b.sessionId === session.id),
  );

  const dayTwoFiltered = dayTwo.filter(
    (session) => !!bookmarks.find((b) => b.sessionId === session.id),
  );

  return (
    <ThemedView style={styles.container} color={theme.color.background}>
      {dayOneFiltered.length || dayTwoFiltered.length ? (
        <FlatList
          ref={scrollRef}
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
        />
      ) : (
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
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatListContainer: {
    paddingTop: theme.space16,
  },
  bookmarks: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: theme.space24,
  },
});
