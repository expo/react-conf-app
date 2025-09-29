import { theme } from "@/theme";
import { StyleSheet, View, Pressable, Platform } from "react-native";
import { ThemedText } from "./Themed";
import { useReactConfStore } from "@/store/reactConfStore";
import { getCurrentConferenceDay } from "@/utils/formatDate";
import { ConferenceDay } from "@/consts";
import { Session } from "@/types";
import { useCallback, useEffect, useState } from "react";
import Animated, { FadeIn, FadeOutUp } from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export type CurrentlyLiveSession = {
  session: Session;
  day: ConferenceDay;
  sessionIndex: number;
};

function getCurrentlyLive(
  dayOne: Session[],
  dayTwo: Session[],
): CurrentlyLiveSession | null {
  const currentDay = getCurrentConferenceDay();
  if (!currentDay) {
    return null;
  }

  const currentSessions = currentDay === ConferenceDay.One ? dayOne : dayTwo;
  const now = new Date();

  for (let i = 0; i < currentSessions.length; i++) {
    const session = currentSessions[i];
    const startTime = new Date(session.startsAt);
    const endTime = new Date(session.endsAt);

    if (now >= startTime && now <= endTime && !session.isServiceSession) {
      return {
        session,
        day: currentDay,
        sessionIndex: i,
      };
    }
  }

  return null;
}

export function CurrentlyLive({
  scrollToSession,
}: {
  scrollToSession: (currentlyLive: CurrentlyLiveSession) => void;
}) {
  const [currentlyLive, setCurrentlyLive] =
    useState<CurrentlyLiveSession | null>(null);
  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);
  const checkCurrentlyLive = useCallback(() => {
    const currentlyLive = getCurrentlyLive(dayOne, dayTwo);
    setCurrentlyLive(currentlyLive);
  }, [dayOne, dayTwo]);

  useEffect(() => {
    checkCurrentlyLive();
    const interval = setInterval(checkCurrentlyLive, 5000);
    return () => clearInterval(interval);
  }, [dayOne, dayTwo, checkCurrentlyLive]);

  return (
    <AnimatedPressable
      key={currentlyLive?.session.id}
      style={styles.container}
      onPressIn={() => {
        if (currentlyLive) {
          scrollToSession(currentlyLive);
        }
      }}
      entering={FadeIn}
      exiting={FadeOutUp}
    >
      {currentlyLive ? (
        <>
          <View style={styles.dotContainer}>
            <View style={styles.dot} />
            <ThemedText
              fontSize={theme.fontSize12}
              fontWeight="semiBold"
              color={theme.color.textSecondary}
              style={styles.text}
            >
              Currently Live
            </ThemedText>
          </View>
          <ThemedText
            fontSize={theme.fontSize14}
            fontWeight="semiBold"
            numberOfLines={2}
            style={styles.centeredText}
          >
            {currentlyLive.session.title}
          </ThemedText>
        </>
      ) : (
        // Without this, the header will not animate in on iOS 26
        <View />
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  centeredText: {
    textAlign: "center",
  },
  container: {
    alignItems: "center",
    width: Platform.select({ android: undefined, default: 180 }),
  },
  dot: {
    backgroundColor: theme.colorRed,
    borderRadius: theme.borderRadius4,
    height: theme.space4,
    width: theme.space4,
  },
  dotContainer: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.space4,
  },
  text: {
    textTransform: "uppercase",
  },
});
