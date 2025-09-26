import { Link, Stack, useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { Platform, StyleSheet, View, useWindowDimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedScrollHandler,
  interpolate,
  Extrapolation,
  Easing,
  useAnimatedReaction,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { Canvas, Fill, Shader, Skia, vec } from "@shopify/react-native-skia";

import { NotFound } from "@/components/NotFound";
import { SpeakerImage } from "@/components/SpeakerImage";
import { ThemedText, ThemedView } from "@/components/Themed";
import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { Session, Speaker } from "@/types";
import { formatSessionTime } from "@/utils/formatDate";
import { HeaderButton } from "@/components/HeaderButtons/HeaderButton";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { scheduleOnRN } from "react-native-worklets";
import { Bookmark } from "@/components/Bookmark";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

const source = Skia.RuntimeEffect.Make(`
uniform float sheetAnim;
uniform vec2 size;

vec4 main(vec2 pos) {
  vec2 normalized = pos/vec2(256);
  vec2 offset;
  float dist;
  offset = (pos - vec2(size.x/2, -size.y));
  dist = sqrt(pow(offset.x, 2.0) + pow(offset.y, 2.0)) / sqrt(pow(size.x/2, 2.0) + pow(size.y/2, 2.0));
  float anim = 1 - sheetAnim;

  offset = (pos - vec2(size.x*anim, size.y*anim));
  dist = sqrt(pow(offset.x, 2.0) + pow(offset.y, 2.0)) / sqrt(pow(size.x/2, 2.0) + pow(size.x/2, 2.0)) - pow(sheetAnim,1.3);
  float mixVal = max(0.0,dist);
  vec4 colorA = vec4(0.345, 0.769, 0.863, 1.0) + vec4(1.0, normalized.x, normalized.y,1.0) / 6.0;
  vec4 colorB = vec4(0.031, 0.494, 0.643, 1.0);

  vec4 color = mix(colorA, colorB, mixVal);
  return vec4(color);
}`)!;

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
  const { width } = useWindowDimensions();

  const router = useRouter();

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const translationY = useSharedValue(0);
  const overscrollAmount = useSharedValue(0);
  const scrollHandler = useAnimatedScrollHandler((event) => {
    translationY.value = event.contentOffset.y;
    const { contentOffset, contentSize, layoutMeasurement } = event;
    const scrollPastBottom = Math.max(
      0,
      contentOffset.y + layoutMeasurement.height - contentSize.height - 20,
    );
    overscrollAmount.value = scrollPastBottom;
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
      opacity: interpolate(translationY.value, [0, 100], [1, 0]),
    };
  });

  const { talk, isDayOne } = findTalk(talkId, { dayOne, dayTwo });

  const insets = useSafeAreaInsets();

  const sheetAnim = useSharedValue(0);
  const hasTriggeredHaptic = useSharedValue(false);

  useAnimatedReaction(
    () => overscrollAmount.value,
    (amount) => {
      if (amount > 0 && !hasTriggeredHaptic.value) {
        hasTriggeredHaptic.value = true;
        scheduleOnRN(triggerHaptic);
      } else if (amount === 0) {
        hasTriggeredHaptic.value = false;
      }

      const normalizedAmount = Math.min(amount / 100, 1);
      sheetAnim.value = withTiming(normalizedAmount, {
        duration: 600,
        easing: Easing.out(Easing.quad),
      });
    },
    [],
  );

  const uniforms = useDerivedValue(
    () => ({
      sheetAnim: sheetAnim.value,
      size: vec(width, 500),
    }),
    [sheetAnim],
  );

  const opacityStyle = useAnimatedStyle(() => ({
    opacity: sheetAnim.value * 0.4,
  }));

  if (!talk) {
    return <NotFound message="Talk not found" />;
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerLeft: () =>
            Platform.select({
              ios: <HeaderButton buttonProps={{ onPress: router.back }} />,
              default: undefined,
            }),
          headerRight: () => <Bookmark session={talk} />,
        }}
      />

      <ThemedView
        style={styles.container}
        color={
          isLiquidGlassAvailable()
            ? { light: "transparent", dark: "transparent" }
            : theme.color.background
        }
      >
        <>
          {isLiquidGlassAvailable() ? (
            <View style={[{ height: 600 }]}>
              <Animated.View style={[opacityStyle, { position: "absolute" }]}>
                <Canvas
                  style={{
                    width: width,
                    height: 600,
                    transform: [{ scale: 2 }],
                  }}
                >
                  <Fill>
                    <Shader source={source} uniforms={uniforms} />
                  </Fill>
                </Canvas>
              </Animated.View>
              <View style={{ height: 600 }}>
                <Animated.View style={[opacityStyle, { position: "absolute" }]}>
                  <Canvas style={{ width: width, height: 600 }}>
                    <Fill>
                      <Shader source={source} uniforms={uniforms} />
                    </Fill>
                  </Canvas>
                </Animated.View>
              </View>
            </View>
          ) : null}
          <AnimatedScrollView
            style={styles.container}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
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
                isDayOne ? theme.color.reactBlue.light : theme.colorLightGreen
              }
              darkColor={
                isDayOne ? "rgba(88,196,220, 0.5)" : "rgba(155,223,177, 0.5)"
              }
              style={[
                styles.header,
                headerStyle,
                { backgroundColor: "transparent" },
              ]}
            >
              <ThemedText
                fontWeight="bold"
                fontSize={32}
                style={styles.talkTitle}
              >
                {talk?.title}
              </ThemedText>
            </ThemedView>
            <ThemedView
              color={
                isLiquidGlassAvailable()
                  ? { light: "transparent", dark: "transparent" }
                  : theme.color.background
              }
              style={styles.content}
            >
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
    minHeight: 150,
    paddingTop: 50,
    paddingHorizontal: theme.space16,
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
    paddingTop: theme.space24,
  },
  sectionContainer: {
    marginBottom: theme.space24,
  },
  content: {
    paddingTop: theme.space16,
    paddingHorizontal: theme.space16,
  },
});
