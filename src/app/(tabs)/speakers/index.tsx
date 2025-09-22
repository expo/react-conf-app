import React, { useCallback } from "react";
import {
  Keyboard,
  Platform,
  Pressable,
  StyleSheet,
  useWindowDimensions,
} from "react-native";

import { NotFound } from "@/components/NotFound";

import { ThemedText, ThemedView, useThemeColor } from "@/components/Themed";
import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { Link, useLocalSearchParams } from "expo-router";
import { useScrollToTop } from "@react-navigation/native";
import { SpeakerDetails } from "@/components/SpeakerDetails";
import { useBookmark } from "@/hooks/useBookmark";
import { Speaker } from "@/types";
import { LegendList } from "@legendapp/list";

export default function Speakers() {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const speakers = useReactConfStore((state) => state.allSessions.speakers);
  const { width } = useWindowDimensions();
  const backgroundColor = useThemeColor(theme.color.background);

  const { toggleBookmarkById, isBookmarked, getSessionById } = useBookmark();

  const params = useLocalSearchParams<{ q?: string }>();

  const searchText = params?.q?.toLowerCase() || "";

  const filteredSpeakers = speakers.filter((speaker) => {
    if (!searchText) {
      return true;
    }
    return speaker.fullName.toLowerCase().includes(searchText);
  });

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const renderItem = useCallback(
    ({ item }: { item: Speaker }) => {
      return (
        <Link
          push
          key={item.id}
          href={{
            pathname: "/speaker/[speaker]",
            params: { speaker: item.id },
          }}
          asChild
        >
          <Link.Trigger>
            <Pressable style={styles.speakerContainer}>
              <SpeakerDetails speaker={item} key={item.id} />
            </Pressable>
          </Link.Trigger>
          <Link.Preview style={{ width: width, height: 350 }} />
          <Link.Menu title={`Talks by ${item.fullName}`}>
            {item.sessions
              .map((sessionId) => {
                const sessionIdStr = sessionId.toString();
                const session = getSessionById(sessionIdStr);
                const bookmarked = isBookmarked(sessionIdStr);

                if (!session) return null;

                return (
                  <Link.MenuAction
                    key={sessionIdStr}
                    title={session.title}
                    icon={bookmarked ? "bookmark.fill" : "bookmark"}
                    isOn={bookmarked}
                    onPress={() => toggleBookmarkById(sessionIdStr)}
                  />
                );
              })
              .filter(
                (item): item is NonNullable<typeof item> => item !== null,
              )}
          </Link.Menu>
        </Link>
      );
    },
    [width, getSessionById, isBookmarked, toggleBookmarkById],
  );

  if (!speakers.length) {
    return <NotFound message="Speakers unavailable" />;
  }

  return (
    <LegendList
      key={`speakers-list-${searchText === "" ? "all" : "filtered"}`}
      scrollToOverflowEnabled
      contentInsetAdjustmentBehavior="automatic"
      onScrollBeginDrag={dismissKeyboard}
      keyboardShouldPersistTaps="handled"
      ref={ref}
      style={{ backgroundColor }}
      contentContainerStyle={styles.contentContainer}
      ItemSeparatorComponent={() => (
        <ThemedView style={{ height: 1 }} color={theme.color.border} />
      )}
      renderItem={renderItem}
      data={filteredSpeakers}
      keyExtractor={(item) => item.id}
      ListEmptyComponent={
        <ThemedView style={styles.noResultsContainer}>
          <ThemedText>
            No results found for{" "}
            <ThemedText fontWeight="bold">{searchText}</ThemedText>
          </ThemedText>
        </ThemedView>
      }
    />
  );
}

export const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: theme.space24,
    paddingBottom: Platform.select({ android: 100, default: 0 }),
  },
  noResultsContainer: {
    padding: theme.space24,
  },
  speakerContainer: {
    paddingVertical: theme.space16,
  },
});
