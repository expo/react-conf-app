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
import { SpeakerDetails } from "@/components/SpeakerDetails";
import { useBookmark } from "@/hooks/useBookmark";
import { Speaker } from "@/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  FadeIn,
  FadeOut,
  LinearTransition,
} from "react-native-reanimated";

export default function Speakers() {
  const speakers = useReactConfStore((state) => state.allSessions.speakers);
  const { width, height } = useWindowDimensions();
  const { bottom, top } = useSafeAreaInsets();
  const { toggleBookmarkById, isBookmarked, getSessionById } = useBookmark();
  const backgroundColor = useThemeColor(theme.color.background);

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
        <Animated.View key={item.id} entering={FadeIn} exiting={FadeOut}>
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
              <Pressable
                onLongPress={() => {
                  // adding this to prevent navigating on long press instead of opening the preview
                }}
                style={styles.speakerContainer}
              >
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
        </Animated.View>
      );
    },
    [width, getSessionById, isBookmarked, toggleBookmarkById],
  );

  if (!speakers.length) {
    return <NotFound message="Speakers unavailable" />;
  }

  return (
    <Animated.FlatList
      scrollToOverflowEnabled
      contentInsetAdjustmentBehavior="automatic"
      onScrollBeginDrag={dismissKeyboard}
      keyboardShouldPersistTaps="handled"
      style={{ backgroundColor }}
      contentContainerStyle={[
        styles.contentContainer,
        { minHeight: height - (bottom + top + 130) },
      ]}
      ItemSeparatorComponent={() => (
        <ThemedView style={{ height: 1 }} color={theme.color.border} />
      )}
      extraData={isBookmarked || searchText}
      renderItem={renderItem}
      data={filteredSpeakers}
      keyExtractor={(item) => item.id}
      itemLayoutAnimation={LinearTransition}
      ListEmptyComponent={
        <Animated.View entering={FadeIn} exiting={FadeOut}>
          <ThemedView style={styles.noResultsContainer}>
            <ThemedText>
              No results found for{" "}
              <ThemedText fontWeight="bold">{searchText}</ThemedText>
            </ThemedText>
          </ThemedView>
        </Animated.View>
      }
    />
  );
}

export const styles = StyleSheet.create({
  contentContainer: {
    paddingHorizontal: theme.space16,
    paddingBottom: Platform.select({ android: 100, default: 0 }),
  },
  noResultsContainer: {
    padding: theme.space24,
  },
  speakerContainer: {
    paddingVertical: theme.space16,
  },
});
