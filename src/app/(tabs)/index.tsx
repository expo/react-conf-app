import { useScrollToTop } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  View,
  ViewToken,
} from "react-native";
import Animated, {
  useAnimatedRef,
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  SharedValue,
  Extrapolation,
  interpolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlatList, Pressable } from "react-native-gesture-handler";

import { ActivityCard } from "@/components/ActivityCard";
import { NotFound } from "@/components/NotFound";
import { ReactConfHeader } from "@/components/ReactConfHeader";
import { TalkCard } from "@/components/TalkCard";
import { ThemedText, ThemedView, useThemeColor } from "@/components/Themed";
import { TimeZoneSwitch } from "@/components/TimeZoneSwitch";
import { COLLAPSED_HEADER, Day, EXPANDED_HEADER, ROW_HEIGHT } from "@/consts";
import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { Session } from "@/types";
import { DayPicker } from "@/components/AnimatedHeader/DayPicker";

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

  const sectionListBackgroundColor = useThemeColor(theme.color.background);

  useFocusEffect(() => {
    refreshSchedule({ ttlMs: 60_000 });
  });

  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);
  const refreshSchedule = useReactConfStore((state) => state.refreshData);
  const isRefreshing = useReactConfStore((state) => !!state.isRefreshing);
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);

  const scrollToSection = (day: Day) => {
    scrollRef.current?.scrollToIndex({
      index: day === Day.DayOne ? 0 : dayOne.length,
      animated: true,
    });
  };

  const onViewableItemsChanged = (items: {
    viewableItems: ViewToken<SessionItem>[];
    changed: ViewToken<SessionItem>[];
  }) => {
    const topVisibleIndex = items.viewableItems?.[0]?.index || 0;
    const isDayOneThreshold = topVisibleIndex <= dayOne.length;
    const isDayTwoThreshold = topVisibleIndex >= dayOne.length;

    if (!shouldShowDayOneHeader && isDayOneThreshold) {
      setShouldShowDayOneHeader(true);
    }

    if (shouldShowDayOneHeader && isDayTwoThreshold) {
      setShouldShowDayOneHeader(false);
    }
  };

  const data = [
    ...dayOne.map((item) => ({ type: "session", day: 1, item })),
    { type: "section-header", day: 2 },
    ...dayTwo.map((item) => ({ type: "session", day: 2, item })),
  ] as SessionItem[];

  if (!dayOne.length || !dayTwo.length) {
    return <NotFound message="Schedule unavailable" />;
  }

  return (
    <ThemedView
      style={[styles.container, { paddingTop: insets.top }]}
      color={theme.color.background}
    >
      <ThemedView style={[styles.container, paddingTopStyle]} animated>
        <AnimatedFlatList
          ref={scrollRef}
          onViewableItemsChanged={onViewableItemsChanged}
          onScroll={scrollHandler}
          style={{ backgroundColor: sectionListBackgroundColor }}
          contentContainerStyle={{
            paddingTop: EXPANDED_HEADER,
            paddingBottom: Platform.select({ android: 100, default: 0 }),
          }}
          scrollEventThrottle={8}
          data={data}
          stickyHeaderIndices={[0]}
          ListHeaderComponent={() => {
            return (
              <DayPicker
                isDayOne={shouldShowDayOneHeader}
                onSelectDay={scrollToSection}
              />
            );
          }}
          renderItem={({ item }) => {
            const isDayOne = item.day === 1;
            if (item.type === "section-header") {
              return (
                <ThemedView
                  style={[
                    styles.sectionHeader,
                    {
                      borderBottomColor: isDayOne
                        ? theme.colorReactLightBlue
                        : theme.colorLightGreen,
                    },
                  ]}
                  color={theme.color.background}
                >
                  <SectionListButton
                    title="Day 1"
                    subtitle={!shouldUseLocalTz ? "(May 15)" : null}
                    isBold={isDayOne}
                    onPress={() => scrollToSection({ isDayOne: true })}
                  />
                  <SectionListButton
                    title="Day 2"
                    subtitle={!shouldUseLocalTz ? "(May 16)" : null}
                    isBold={!isDayOne}
                    onPress={() => scrollToSection({ isDayOne: false })}
                  />
                </ThemedView>
              );
            }

            if (item.item.isServiceSession) {
              return <ActivityCard session={item.item} />;
            } else {
              return (
                <TalkCard
                  key={item.item.id}
                  session={item.item}
                  isDayOne={isDayOne}
                />
              );
            }
          }}
        />
        <Header scrollOffset={scrollOffset} refreshing={isRefreshing} />
      </ThemedView>
    </ThemedView>
  );
}

const SectionListButton = ({
  onPress,
  isBold,
  title,
  subtitle,
}: {
  onPress: () => void;
  isBold: boolean;
  title: string;
  subtitle: string | null;
}) => {
  const opacity = { opacity: isBold ? 1 : 0.5 };

  return (
    <Pressable onPress={onPress}>
      <ThemedText
        fontWeight="bold"
        lightColor={theme.colorBlack}
        darkColor={theme.colorWhite}
        fontSize={24}
        style={opacity}
      >
        {title}
        {subtitle ? (
          <ThemedText fontWeight="medium"> {subtitle} </ThemedText>
        ) : null}
      </ThemedText>
    </Pressable>
  );
};

interface HeaderProps {
  scrollOffset: SharedValue<number>;
  refreshing: boolean;
}

function Header({ scrollOffset, refreshing }: HeaderProps) {
  const settingsBgColor = useThemeColor({
    light: theme.colorThemeGrey,
    dark: "rgba(255, 255, 255, 0.2)",
  });

  const animatedHeader = useAnimatedStyle(() => ({
    height: interpolate(
      scrollOffset.value,
      [0, EXPANDED_HEADER],
      [EXPANDED_HEADER, 0],
    ),
  }));

  const animatedRow = useAnimatedStyle(() => ({
    height: interpolate(
      scrollOffset.value,
      [0, ROW_HEIGHT],
      [ROW_HEIGHT, 0],
      Extrapolation.CLAMP,
    ),
    paddingVertical: interpolate(
      scrollOffset.value,
      [0, ROW_HEIGHT],
      [theme.space8, 0],
      Extrapolation.CLAMP,
    ),
  }));

  return (
    <Animated.View style={[styles.header, animatedHeader]}>
      <ReactConfHeader scrollOffset={scrollOffset} />
      <Animated.View
        style={[styles.row, { backgroundColor: settingsBgColor }, animatedRow]}
      >
        <TimeZoneSwitch />
      </Animated.View>
      <View style={{ position: "absolute", right: 20, top: 15 }}>
        <ActivityIndicator
          size="small"
          hidesWhenStopped={true}
          animating={refreshing}
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  sectionHeader: {
    marginBottom: theme.space12,
    paddingHorizontal: theme.space16,
    paddingVertical: theme.space12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 3,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.space8,
    backgroundColor: theme.colorThemeLightGrey,
    overflow: "hidden",
  },
  header: {
    position: "absolute",
    top: 0,
    zIndex: 1,
    width: "100%",
  },
});
