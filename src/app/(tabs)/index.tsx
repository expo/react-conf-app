import { useScrollToTop } from "@react-navigation/native";
import { useFocusEffect } from "expo-router";
import React, { useRef, useState } from "react";
import { Platform } from "react-native";
import { FlatList } from "react-native-gesture-handler";

import { ActivityCard } from "@/components/ActivityCard";
import { NotFound } from "@/components/NotFound";
import { TalkCard } from "@/components/TalkCard";
import { ConferenceDay } from "@/consts";
import { useReactConfStore } from "@/store/reactConfStore";
import { HomeHeader } from "@/components/HomeHeader";
import { DayPicker } from "@/components/DayPicker";
import { ThemedView } from "@/components/Themed";

export default function Schedule() {
  // TODO (Kadi): choose day based on the date
  const [selectedDay, setSelectedDay] = useState(ConferenceDay.One);
  const scrollRef = useRef<FlatList>(null);
  useScrollToTop(scrollRef as any);

  useFocusEffect(() => {
    refreshSchedule({ ttlMs: 60_000 });
  });

  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);
  const refreshSchedule = useReactConfStore((state) => state.refreshData);
  const data = selectedDay === ConferenceDay.One ? dayOne : dayTwo;

  const handleSelectDay = (day: ConferenceDay) => {
    scrollRef.current?.scrollToOffset({
      offset: 0,
      animated: true,
    });
    setSelectedDay(day);
  };

  if (!dayOne.length || !dayTwo.length) {
    return <NotFound message="Schedule unavailable" />;
  }

  return (
    <ThemedView style={{ flex: 1 }}>
      <HomeHeader />
      <FlatList
        ref={scrollRef}
        contentContainerStyle={{
          paddingBottom: Platform.select({ android: 100, default: 0 }),
        }}
        data={data}
        ListHeaderComponent={
          <DayPicker selectedDay={selectedDay} onSelectDay={handleSelectDay} />
        }
        stickyHeaderIndices={[0]}
        renderItem={({ item }) => {
          if (item.isServiceSession) {
            return <ActivityCard session={item} />;
          } else {
            return <TalkCard key={item.id} session={item} day={selectedDay} />;
          }
        }}
      />
    </ThemedView>
  );
}
