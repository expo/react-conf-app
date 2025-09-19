import { Image } from "expo-image";
import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { Pressable, ScrollView } from "react-native-gesture-handler";

import { NotFound } from "@/components/NotFound";
import { SpeakerImage } from "@/components/SpeakerImage";
import { ThemedText, ThemedView, useThemeColor } from "@/components/Themed";
import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { Session, Speaker } from "@/types";
import { formatSessionTime } from "@/utils/formatDate";
import { HeaderButton } from "@/components/HeaderButtons/HeaderButton";
import { useBookmark } from "@/hooks/useBookmark";
import { isLiquidGlassAvailable } from "expo-glass-effect";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const findTalk = (
  talkId: string | string[] | undefined,
  { dayOne, dayTwo }: { dayOne: Session[]; dayTwo: Session[] },
) => {
  const talkDay1 = dayOne.find((session) => session.id === talkId);
  if (talkDay1) {
    return { talk: talkDay1, isDayOne: true };
  }
  const talkDay2 = dayTwo.find((session) => session.id === talkId);
  if (talkDay2) {
    return { talk: talkDay2, isDayOne: false };
  }

  return { talk: null, isDayOne: false };
};

export default function TalkDetail() {
  const params = useLocalSearchParams();
  const talkId = params.talkId || undefined;
  const { dayOne, dayTwo } = useReactConfStore((state) => state.schedule);
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);
  const { toggleBookmark, isBookmarked } = useBookmark();
  const tintColor = useThemeColor({
    light: theme.colorReactLightBlue,
    dark: theme.colorReactDarkBlue,
  });

  const router = useRouter();

  // Animated header on scroll (iOS only)
  const translationY = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
  });
  const headerStyle = useAnimatedStyle(() => {
    if (Platform.OS !== "ios") {
      return {};
    }
    return {
      transform: [
        {
          translateY: interpolate(
            translationY.value,
            [-120, 0, 150],
            [-90, 0, 120],
            Extrapolation.CLAMP,
          ),
        },
        {
          scale: interpolate(
            translationY.value,
            [-120, 0],
            [1, 0.8],
            Extrapolation.CLAMP,
          ),
        },
      ],
      opacity: interpolate(translationY.value, [0, 100], [1, 0.6]),
    };
  });

  const { talk, isDayOne } = findTalk(talkId, { dayOne, dayTwo });

  const insets = useSafeAreaInsets();
  const iconColor = useThemeColor(theme.color.background);

  if (!talk) {
    return <NotFound message="Talk not found" />;
  }

  const bookmarked = isBookmarked(talk.id);
  const bookmarkedColor = bookmarked
    ? theme.colorReactLightBlue
    : theme.colorGrey;

  return (
    <>
      <Stack.Screen
        options={{
          headerShown: true,
          presentation: "modal",
          headerLeft: () =>
            Platform.select({
              ios: <HeaderButton buttonProps={{ onPress: router.back }} />,
              default: undefined,
            }),
          headerRight: () => (
            <HeaderButton
              buttonProps={{
                onPress: () => toggleBookmark(talk),
                variant: "glassProminent",
                color: tintColor,
              }}
              imageProps={{
                systemName: Platform.select({
                  ios: bookmarked ? "bookmark.fill" : "bookmark",
                  default: "bookmark",
                }),
                color: Platform.select({
                  ios: isLiquidGlassAvailable() ? "white" : bookmarkedColor,
                  default: bookmarkedColor,
                }),
              }}
            />
          ),
        }}
      />
      <ThemedView style={styles.container} color={theme.color.background}>
        {talk ? (
          <>
            <AnimatedScrollView
              style={styles.container}
              contentInsetAdjustmentBehavior="automatic"
              onScroll={scrollHandler}
              scrollEventThrottle={8}
              contentContainerStyle={[
                styles.contentContainer,
                {
                  paddingBottom: insets.bottom + theme.space24,
                },
              ]}
            >
              <ThemedView
                animated
                lightColor={
                  isDayOne ? theme.colorReactLightBlue : theme.colorLightGreen
                }
                darkColor={
                  isDayOne ? "rgba(88,196,220, 0.5)" : "rgba(155,223,177, 0.5)"
                }
                style={[styles.header, headerStyle]}
              >
                <Image
                  tintColor={iconColor}
                  source={require("@/assets/images/react-logo.png")}
                  style={styles.reactLogo}
                />
                <View style={styles.centered}>
                  <ThemedText
                    fontWeight="bold"
                    fontSize={32}
                    style={styles.talkTitle}
                  >
                    {talk?.title}
                  </ThemedText>
                </View>
              </ThemedView>
              <ThemedView color={theme.color.background} style={styles.content}>
                {talk.speakers.map((speaker) => (
                  <Link
                    push
                    key={speaker.id}
                    href={{
                      pathname: "/speaker/[speaker]",
                      params: { speaker: speaker.id },
                    }}
                    asChild
                  >
                    <Pressable>
                      <SpeakerDetails speaker={speaker} />
                    </Pressable>
                  </Link>
                ))}
                <Section
                  title="Date"
                  value={
                    isDayOne
                      ? "May 15, 2024 (Conference Day 1)"
                      : "May 15, 2024 (Conference Day 2)"
                  }
                />
                <Section
                  title="Time"
                  value={formatSessionTime(talk, shouldUseLocalTz)}
                />
                <Section title="Venue" value={talk.room} />
                <Section title="Description" value={talk.description} />
              </ThemedView>
            </AnimatedScrollView>
          </>
        ) : (
          <NotFound message="Talk not found" />
        )}
      </ThemedView>
    </>
  );
}

function SpeakerDetails({ speaker }: { speaker: Speaker }) {
  return (
    <View style={styles.speaker}>
      <SpeakerImage profilePicture={speaker.profilePicture} />
      <View style={styles.speakerDetails}>
        <ThemedText fontSize={18} fontWeight="bold">
          {speaker.fullName}
        </ThemedText>
        <ThemedText fontSize={16} fontWeight="medium">
          {speaker.tagLine}
        </ThemedText>
      </View>
    </View>
  );
}

function Section({ title, value }: { title: string; value: string | null }) {
  if (!value) {
    return null;
  }

  return (
    <View style={styles.sectionContainer}>
      <ThemedText fontSize={18} fontWeight="bold">
        {title}
      </ThemedText>
      <ThemedText fontSize={18} fontWeight="medium">
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: 250,
    paddingTop: 50,
    paddingHorizontal: theme.space16,
    overflow: "hidden",
  },
  contentContainer: {
    borderBottomRightRadius: theme.borderRadius20,
    borderBottomLeftRadius: theme.borderRadius20,
  },
  speaker: {
    flexDirection: "row",
    marginBottom: theme.space12,
  },
  speakerDetails: {
    flex: 1,
    justifyContent: "center",
  },
  talkTitle: {
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
  },
  reactLogo: {
    position: "absolute",
    right: -100,
    top: "30%",
    height: 300,
    width: 300,
    opacity: 0.2,
  },
  sectionContainer: {
    marginBottom: theme.space24,
  },
  content: {
    paddingTop: theme.space16,
    paddingHorizontal: theme.space16,
  },
});
