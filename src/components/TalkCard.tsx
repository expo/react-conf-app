import { Link, useRouter } from "expo-router";
import { StyleSheet, useWindowDimensions, View } from "react-native";

import { Bookmark } from "./Bookmark";
import { ThemedText, ThemedView } from "./Themed";
import { theme } from "../theme";
import { Session, Speaker } from "@/types";
import { formatSessionTime } from "../utils/formatDate";

import { useReactConfStore } from "@/store/reactConfStore";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { SpeakerDetails } from "./SpeakerDetails";
import { ConferenceDay } from "@/consts";
import * as Haptics from "expo-haptics";
import { useMemo } from "react";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

type Props = {
  session: Session;
  day: ConferenceDay;
  isBookmarked?: boolean;
};

export function TalkCard({ session, day, isBookmarked = false }: Props) {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);
  const { width } = useWindowDimensions();
  const router = useRouter();

  const gestureTalkTap = useMemo(
    () =>
      Gesture.Tap()
        .maxDistance(10)
        .runOnJS(true)
        .onEnd(() => {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          router.push({
            pathname: "/talk/[talk]",
            params: { talk: session.id },
          });
        }),
    [router, session.id],
  );

  const createSpeakerTapGesture = (speaker: Speaker) =>
    Gesture.Tap()
      .maxDistance(10)
      .runOnJS(true)
      .onEnd(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        router.push({
          pathname: "/speaker/[speaker]",
          params: { speaker: speaker.id },
        });
      });

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <GestureDetector gesture={gestureTalkTap}>
        <ThemedView style={styles.container}>
          {!isBookmarked && (
            <ThemedText
              fontSize={theme.fontSize14}
              fontWeight="medium"
              color={theme.color.textSecondary}
              marginBottom={theme.space8}
              style={{ marginLeft: theme.space24 }}
            >
              {formatSessionTime(session, shouldUseLocalTz)}
            </ThemedText>
          )}
          <ThemedView
            color={theme.color.backgroundSecondary}
            style={styles.content}
          >
            <View
              style={{
                marginHorizontal: -theme.space16,
                paddingHorizontal: theme.space16,
                marginVertical: -theme.space8,
                paddingVertical: theme.space8,
              }}
            >
              <View style={styles.titleAndBookmark}>
                <ThemedText
                  fontSize={theme.fontSize18}
                  fontWeight="semiBold"
                  style={styles.title}
                >
                  {session.title}
                </ThemedText>
              </View>
              {isBookmarked && (
                <View style={styles.time}>
                  <ThemedText
                    fontSize={theme.fontSize14}
                    fontWeight="medium"
                    color={theme.color.textSecondary}
                  >
                    {formatSessionTime(session, shouldUseLocalTz)},
                  </ThemedText>
                  <ThemedText
                    fontSize={theme.fontSize14}
                    fontWeight="medium"
                    color={theme.color.textSecondary}
                  >
                    {day === ConferenceDay.One ? "Day 1" : "Day 2"}
                  </ThemedText>
                </View>
              )}
            </View>
            <View style={styles.bookmarkContainer}>
              <Bookmark session={session} size="small" />
            </View>
            {session.speakers.map((speaker) => (
              <GestureDetector
                key={speaker.id}
                gesture={createSpeakerTapGesture(speaker)}
              >
                <Link
                  href={{
                    pathname: "/speaker/[speaker]",
                    params: { speaker: speaker.id },
                  }}
                  asChild
                >
                  <Link.Trigger>
                    <View
                      style={{
                        marginHorizontal: -theme.space16,
                        paddingHorizontal: theme.space16,
                        marginVertical: -theme.space8,
                        paddingVertical: theme.space8,
                        borderRadius: theme.borderRadius32,
                      }}
                    >
                      <SpeakerDetails speaker={speaker} />
                    </View>
                  </Link.Trigger>
                  <Link.Preview style={{ ...styles.preview, width }} />
                </Link>
              </GestureDetector>
            ))}
          </ThemedView>
        </ThemedView>
      </GestureDetector>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bookmarkContainer: {
    position: "absolute",
    right: theme.space24,
    top: theme.space24,
  },
  container: {
    borderRadius: theme.borderRadius10,
    marginBottom: theme.space24,
    marginHorizontal: theme.space16,
  },
  content: {
    borderRadius: theme.borderRadius32,
    gap: theme.space24,
    padding: theme.space24,
  },
  preview: {
    height: 420,
  },
  time: {
    borderRadius: theme.borderRadius10,
    flexDirection: "row",
    gap: theme.space8,
  },
  title: {
    flex: 1,
    marginRight: 40,
  },
  titleAndBookmark: {
    alignItems: "center",
    flexDirection: "row",
    gap: theme.space8,
    justifyContent: "space-between",
  },
});
