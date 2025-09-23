import { useScrollToTop } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { Platform, RefreshControl } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import Animated, {
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ActivityCard } from "@/components/ActivityCard";
import { NotFound } from "@/components/NotFound";
import { TalkCard } from "@/components/TalkCard";
import { ConferenceDay } from "@/consts";
import { useReactConfStore } from "@/store/reactConfStore";
import { DayPicker } from "@/components/DayPicker";
import { useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { Session } from "@/types";
import { isLiquidGlassAvailable } from "expo-glass-effect";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as FlatList;

export default function Schedule() {
  // TODO (Kadi): choose day based on the date
  const [selectedDay, setSelectedDay] = useState(ConferenceDay.One);
  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef as any);
  const backgroundColor = useThemeColor(theme.color.background);
  const isLiquidGlass = isLiquidGlassAvailable();
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const translationY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
  });

  const stickyHeaderStyle = useAnimatedStyle(() => {
    if (Platform.OS !== "ios") {
      return {};
    }

    // Move the sticky header up during header collapse, then keep it in position
    const translateY = interpolate(
      translationY.value,
      [-160, -93, 0], // Header visible -> collapsing -> collapsed
      [0, -40, 40], // No movement -> move up by header collapse amount -> stay there
      Extrapolation.CLAMP,
    );

    // Add safe area padding once header is collapsed
    const paddingTop = interpolate(
      translationY.value,
      [-160, -93, 0],
      [0, insets.top, insets.top],
      Extrapolation.CLAMP,
    );

    return {
      transform: [{ translateY }],
      paddingTop,
      backgroundColor: isLiquidGlass ? "transparent" : backgroundColor,
    };
  });

  const renderItem = useCallback(
    ({ item }: { item: Session }) => {
      if (item.isServiceSession) {
        return <ActivityCard session={item} />;
      } else {
        return <TalkCard key={item.id} session={item} day={selectedDay} />;
      }
    },
    [selectedDay],
  );

  const StickyHeader = () => (
    <Animated.View style={[stickyHeaderStyle]}>
      <DayPicker selectedDay={selectedDay} onSelectDay={handleSelectDay} />
    </Animated.View>
  );

  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);
  const refreshSchedule = useReactConfStore((state) => state.refreshData);
  const data = selectedDay === ConferenceDay.One ? dayOne : dayTwo;

  useFocusEffect(() => {
    refreshSchedule({ ttlMs: 60_000 });
  });

  const handleSelectDay = (day: ConferenceDay) => {
    setSelectedDay(day);
    if (translationY.value > 10) {
      setTimeout(() => {
        scrollRef.current?.scrollToOffset({ offset: -30, animated: true });
      }, 100);
    }
  };

  if (!dayOne.length || !dayTwo.length) {
    return <NotFound message="Schedule unavailable" />;
  }

  const handleRefreshSchedule = async () => {
    setIsRefreshing(true);
    await Promise.all([
      new Promise((resolve) => setTimeout(resolve, 1000)),
      refreshSchedule(),
    ]);
    setIsRefreshing(false);
  };

  return (
    <AnimatedFlatList
      ref={scrollRef}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefreshSchedule}
        />
      }
      style={{ backgroundColor }}
      contentContainerStyle={{
        paddingBottom: Platform.select({ android: 100, default: 0 }),
      }}
      contentInsetAdjustmentBehavior="automatic"
      scrollToOverflowEnabled
      onScroll={scrollHandler}
      scrollEventThrottle={16}
      data={data}
      ListHeaderComponent={<StickyHeader />}
      stickyHeaderIndices={[0]}
      keyExtractor={(item: Session) => item.id}
      renderItem={renderItem}
    />
  );
}
