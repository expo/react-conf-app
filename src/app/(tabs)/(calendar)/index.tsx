import { useScrollToTop } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useMemo, useRef, useState } from "react";
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
import { scheduleOnRN } from "react-native-worklets";
import { getInitialDay } from "@/utils/formatDate";

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList) as FlatList;

export default function Schedule() {
  const [selectedDay, setSelectedDay] = useState(getInitialDay());
  const scrollRef = useRef<FlatList>(null);
  const isScrolledDown = useRef(false);
  useScrollToTop(scrollRef as any);
  const backgroundColor = useThemeColor(theme.color.background);
  const isLiquidGlass = isLiquidGlassAvailable();
  const insets = useSafeAreaInsets();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const translationY = useSharedValue(0);
  const animatedTranslateY = useSharedValue(0);
  const animatedPaddingTop = useSharedValue(0);

  const updateIsScrolledDown = useCallback((offsetY: number) => {
    isScrolledDown.current = offsetY > 10;
  }, []);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;

    animatedTranslateY.value = interpolate(
      event.contentOffset.y,
      [-160, -93, 0],
      [0, -40, 40],
      Extrapolation.CLAMP,
    );

    animatedPaddingTop.value = interpolate(
      event.contentOffset.y,
      [-160, -93, 0],
      [0, insets.top, insets.top],
      Extrapolation.CLAMP,
    );

    scheduleOnRN(updateIsScrolledDown, event.contentOffset.y);
  });

  const stickyHeaderStyle = useAnimatedStyle(() => {
    if (Platform.OS !== "ios") {
      return {};
    }

    return {
      transform: [{ translateY: animatedTranslateY.value }],
      paddingTop: animatedPaddingTop.value,
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

  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);
  const refreshSchedule = useReactConfStore((state) => state.refreshData);
  const data = selectedDay === ConferenceDay.One ? dayOne : dayTwo;

  useFocusEffect(() => {
    refreshSchedule({ ttlMs: 60_000 });
  });

  const handleSelectDay = useCallback((day: ConferenceDay) => {
    setSelectedDay(day);
    if (isScrolledDown.current) {
      scrollRef.current?.scrollToOffset({ offset: -30, animated: true });
    }
  }, []);

  const renderStickyHeader = useMemo(
    () => (
      <Animated.View style={stickyHeaderStyle}>
        <DayPicker selectedDay={selectedDay} onSelectDay={handleSelectDay} />
      </Animated.View>
    ),
    [handleSelectDay, selectedDay, stickyHeaderStyle],
  );

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
      ListHeaderComponent={renderStickyHeader}
      stickyHeaderIndices={[0]}
      keyExtractor={(item: Session) => item.id}
      renderItem={renderItem}
    />
  );
}
