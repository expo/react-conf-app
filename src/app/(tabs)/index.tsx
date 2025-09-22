import { useScrollToTop } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform, StyleSheet, View, ViewToken } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { ActivityCard } from "@/components/ActivityCard";
import { NotFound } from "@/components/NotFound";
import { TalkCard } from "@/components/TalkCard";
import { ThemedText, ThemedView, useThemeColor } from "@/components/Themed";
import { ConferenceDay } from "@/consts";
import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { Session } from "@/types";
import { HomeHeader } from "@/components/HomeHeader";
import { DayPicker } from "@/components/DayPicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";

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

export default function Schedule() {
  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef as any);
  const [shouldShowDayOneHeader, setShouldShowDayOneHeader] = useState(true);
  const insets = useSafeAreaInsets();
  const sectionListBackgroundColor = useThemeColor(theme.color.background);

  useFocusEffect(() => {
    refreshSchedule({ ttlMs: 60_000 });
  });

  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);
  const refreshSchedule = useReactConfStore((state) => state.refreshData);

  const scrollToSection = (day: ConferenceDay) => {
    if (day === ConferenceDay.One) {
      scrollRef.current?.scrollToOffset({
        offset: 0,
        animated: true,
      });
    } else {
      scrollRef.current?.scrollToIndex({
        index: dayOne.length - 1,
        animated: true,
        viewOffset: -30
      });
    }
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
    <ThemedView style={{ flex: 1 }}>
      <FlatList
        ref={scrollRef}
        onViewableItemsChanged={onViewableItemsChanged}
        style={{ backgroundColor: sectionListBackgroundColor }}
        contentContainerStyle={{
          paddingBottom: Platform.select({ android: 100, default: 0 }),
          marginTop: insets.top,
        }}
        data={data}
        stickyHeaderIndices={[0]}
        ListHeaderComponent={() => (
          <DayPicker
            isDayOne={shouldShowDayOneHeader}
            onSelectDay={scrollToSection}
          />
        )}
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
      <HomeHeader />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  sectionHeader: {
    marginBottom: theme.space12,
    paddingHorizontal: theme.space24,
  },
});
