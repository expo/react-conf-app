import * as Haptics from "expo-haptics";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { HolographicGradient } from "./HolographicGradient";
import { scheduleOnRN } from "react-native-worklets";
import { ThemedText, ThemedView } from "../Themed";
import { theme } from "@/theme";
import * as Application from "expo-application";

const CONTAINER_SIZE = 160;
const SHADER_SIZE = 140;
const LOGO_SIZE = 120;
const FLIPPED_CONTENT_SIZE = 80;

const SHADER_OFFSET = (CONTAINER_SIZE - SHADER_SIZE) / 2;
const LOGO_OFFSET = (CONTAINER_SIZE - LOGO_SIZE) / 2;
const BORDER_RADIUS = SHADER_SIZE / 2;

interface GestureContainerProps {
  children: React.ReactNode;
  width: number;
  height: number;
  maxAngle?: number;
  onFlip?: () => void;
}

function GestureContainer({
  children,
  width,
  height,
  maxAngle = 10,
  onFlip,
}: GestureContainerProps) {
  const rotateX = useSharedValue(0);
  const rotateY = useSharedValue(0);
  const flipRotation = useSharedValue(0);
  const isFlipped = useSharedValue(false);

  const triggerHeavyHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
  };

  const handleFlip = () => {
    "worklet";
    isFlipped.value = !isFlipped.value;
    flipRotation.value = withTiming(isFlipped.value ? 360 : 0, {
      duration: 600,
      easing: Easing.inOut(Easing.cubic),
    });
    if (onFlip) {
      scheduleOnRN(onFlip);
    }
    scheduleOnRN(triggerHeavyHaptic);
  };

  const interpolateRotation = (
    value: number,
    size: number,
    isReverse = false,
  ) => {
    "worklet";
    return interpolate(
      value,
      [0, size],
      isReverse ? [maxAngle, -maxAngle] : [-maxAngle, maxAngle],
      Extrapolation.CLAMP,
    );
  };

  // Double-tap gesture for flip animation
  const doubleTapGesture = Gesture.Tap()
    .numberOfTaps(2)
    .onEnd(() => {
      handleFlip();
    });

  const panGesture = Gesture.Pan()
    .onBegin((event) => {
      const x = event.x || 0;
      const y = event.y || 0;
      rotateX.value = withTiming(interpolateRotation(y, height, true));
      rotateY.value = withTiming(interpolateRotation(x, width));
    })
    .onUpdate((event) => {
      const x = event.x || 0;
      const y = event.y || 0;
      rotateX.value = interpolateRotation(y, height, true);
      rotateY.value = interpolateRotation(x, width);
    })
    .onFinalize(() => {
      rotateX.value = withTiming(0);
      rotateY.value = withTiming(0);
    });

  // Combine gestures
  const gesture = Gesture.Simultaneous(doubleTapGesture, panGesture);

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { perspective: 300 },
        { rotateX: `${rotateX.value}deg` },
        { rotateY: `${rotateY.value + flipRotation.value}deg` },
      ],
    };
  });

  return (
    <GestureDetector gesture={gesture}>
      <ThemedView
        style={[{ height, width }, rStyle]}
        color={theme.color.transparent}
        animated
      >
        {children}
      </ThemedView>
    </GestureDetector>
  );
}

export function PoweredByExpo() {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const overlayOpacity = useSharedValue(0);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
    overlayOpacity.value = withTiming(isFlipped ? 0 : 1, {
      duration: 300,
      easing: Easing.inOut(Easing.cubic),
    });
  };

  const overlayAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: overlayOpacity.value,
    };
  });

  return (
    <ThemedView style={styles.container} color={theme.color.transparent}>
      <GestureContainer
        width={CONTAINER_SIZE}
        height={CONTAINER_SIZE}
        maxAngle={15}
        onFlip={handleFlip}
      >
        <ThemedView style={styles.layeredView} color={theme.color.transparent}>
          <View style={styles.cardSide}>
            <View style={styles.shaderBackground}>
              <HolographicGradient />
            </View>
            <Image
              source={require("@/assets/images/sub-expo.png")}
              style={styles.logoOverlay}
            />
          </View>
          <ThemedView
            color={theme.color.transparent}
            style={[styles.flippedOverlay, overlayAnimatedStyle]}
            animated
          >
            <View style={styles.flippedContent}>
              <ThemedText
                fontSize={theme.fontSize16}
                fontWeight="semiBold"
                color={{
                  light: theme.colorWhite,
                  dark: theme.colorWhite,
                }}
              >
                v{Application.nativeApplicationVersion} (
                {Application.nativeBuildVersion})
              </ThemedText>
            </View>
          </ThemedView>
        </ThemedView>
      </GestureContainer>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  cardSide: {
    alignItems: "center",
    height: CONTAINER_SIZE,
    justifyContent: "center",
    position: "absolute",
    width: CONTAINER_SIZE,
  },
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
    paddingVertical: theme.space16,
  },
  flippedContent: {
    alignItems: "center",
    backgroundColor: theme.colorBlack,
    borderRadius: 30,
    height: FLIPPED_CONTENT_SIZE,
    justifyContent: "center",
    width: FLIPPED_CONTENT_SIZE,
  },
  flippedOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center",
    justifyContent: "center",
  },
  layeredView: {
    alignItems: "center",
    height: CONTAINER_SIZE,
    justifyContent: "center",
    position: "relative",
    width: CONTAINER_SIZE,
  },
  logoOverlay: {
    height: LOGO_SIZE,
    left: LOGO_OFFSET,
    position: "absolute",
    resizeMode: "contain",
    top: LOGO_OFFSET,
    width: LOGO_SIZE,
  },
  shaderBackground: {
    borderColor: theme.colorBlack,
    borderRadius: BORDER_RADIUS,
    borderWidth: 2,
    height: SHADER_SIZE,
    left: SHADER_OFFSET,
    overflow: "hidden",
    position: "absolute",
    top: SHADER_OFFSET,
    width: SHADER_SIZE,
  },
});
