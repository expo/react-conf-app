import { useScrollToTop } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import { Platform, StyleSheet, View, ViewToken } from "react-native";
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  Extrapolation,
  interpolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList } from "react-native-gesture-handler";

import { ActivityCard } from "@/components/ActivityCard";
import { NotFound } from "@/components/NotFound";
import { TalkCard } from "@/components/TalkCard";
import { ThemedText, ThemedView, useThemeColor } from "@/components/Themed";
import {
  COLLAPSED_HEADER,
  ConferenceDay,
  EXPANDED_HEADER,
  ROW_HEIGHT,
} from "@/consts";
import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { Session } from "@/types";
import { DayPicker } from "@/components/AnimatedHeader/DayPicker";
import { AnimatedHeader } from "@/components/AnimatedHeader";
import { ExpandedHeader } from "@/components/AnimatedHeader/ExpandedHeader";

type SessionItem =
  | {
      type: "session";
      day: number;
      item: Session;
    }
  | {
      type: "section-header";
      day: number;
    };

const AnimatedFlatList = Animated.createAnimatedComponent(
  FlatList<SessionItem>,
);

export default function Schedule() {
  const insets = useSafeAreaInsets();
  const scrollRef = useAnimatedRef<FlatList>();
  useScrollToTop(scrollRef as any);
  const [shouldShowDayOneHeader, setShouldShowDayOneHeader] = useState(true);

  const scrollOffset = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
  });

  const paddingTopStyle = useAnimatedStyle(() => ({
    paddingTop: interpolate(
      scrollOffset.value,
      [COLLAPSED_HEADER, EXPANDED_HEADER],
      [0, ROW_HEIGHT],
      Extrapolation.CLAMP,
    ),
  }));

  const paddingBottomStyle = useAnimatedStyle(() => ({
    paddingBottom: interpolate(
      scrollOffset.value,
      [0, 600],
      [0, 600],
      Extrapolation.CLAMP,
    ),
  }));

  const sectionListBackgroundColor = useThemeColor(theme.color.background);

  useFocusEffect(() => {
    refreshSchedule({ ttlMs: 60_000 });
  });

  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);
  const refreshSchedule = useReactConfStore((state) => state.refreshData);

  const scrollToSection = (day: ConferenceDay) => {
    scrollRef.current?.scrollToIndex({
      index: day === ConferenceDay.One ? 0 : dayOne.length - 1,
      animated: true,
    });
  };

  const onViewableItemsChanged = (items: {
    viewableItems: ViewToken<SessionItem>[];
    changed: ViewToken<SessionItem>[];
  }) => {
    const topVisibleIndex = items.viewableItems?.[0]?.index || 0;
    const isDayOneThreshold = topVisibleIndex <= dayOne.length - 1;
    const isDayTwoThreshold = topVisibleIndex >= dayOne.length - 1;

    if (!shouldShowDayOneHeader && isDayOneThreshold) {
      setShouldShowDayOneHeader(true);
    }

    if (shouldShowDayOneHeader && isDayTwoThreshold) {
      setShouldShowDayOneHeader(false);
    }
  };

  const data = [
    ...dayOne.map((item) => ({
      type: "session",
      day: ConferenceDay.One,
      item,
    })),
    { type: "section-header", day: ConferenceDay.Two },
    ...dayTwo.map((item) => ({
      type: "session",
      day: ConferenceDay.Two,
      item,
    })),
  ] as SessionItem[];

  if (!dayOne.length || !dayTwo.length) {
    return <NotFound message="Schedule unavailable" />;
  }

  return (
    <ThemedView color={theme.color.background} style={styles.container}>
      <AnimatedFlatList
        ref={scrollRef}
        onViewableItemsChanged={onViewableItemsChanged}
        onScroll={scrollHandler}
        style={{ backgroundColor: sectionListBackgroundColor }}
        contentContainerStyle={{
          paddingBottom: Platform.select({ android: 100, default: 0 }),
        }}
        scrollEventThrottle={8}
        data={data}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={() => {
          return (
            <Animated.View style={paddingBottomStyle}>
              <ExpandedHeader scrollOffset={scrollOffset} />
              <DayPicker
                isDayOne={shouldShowDayOneHeader}
                onSelectDay={scrollToSection}
              />
            </Animated.View>
          );
        }}
        renderItem={({ item }) => {
          if (item.type === "section-header") {
            return (
              <ThemedView style={styles.sectionHeader}>
                <ThemedText fontWeight="bold" fontSize={24}>
                  Day 2
                </ThemedText>
              </ThemedView>
            );
          }

          if (item.item.isServiceSession) {
            return <ActivityCard session={item.item} />;
          } else {
            return (
              <TalkCard key={item.item.id} session={item.item} day={item.day} />
            );
          }
        }}
      />
      <AnimatedHeader />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 80,
  },
  sectionHeader: {
    marginBottom: theme.space12,
    paddingHorizontal: theme.space24,
    paddingVertical: theme.space12,
  },
});
