import * as Haptics from "expo-haptics";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  Easing,
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { HolographicGradient } from "./HolographicGradient";
import { scheduleOnRN } from "react-native-worklets";
import { ThemedText } from "../Themed";
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
      <Animated.View
        style={[
          {
            height,
            width,
            backgroundColor: "transparent",
          },
          rStyle,
        ]}
      >
        {children}
      </Animated.View>
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
    <View style={styles.container}>
      <GestureContainer
        width={CONTAINER_SIZE}
        height={CONTAINER_SIZE}
        maxAngle={15}
        onFlip={handleFlip}
      >
        <View style={styles.layeredView}>
          <View style={styles.cardSide}>
            <View style={styles.shaderBackground}>
              <HolographicGradient />
            </View>
            <Image
              source={require("@/assets/images/sub-expo.png")}
              style={styles.logoOverlay}
            />
          </View>
          <Animated.View style={[styles.flippedOverlay, overlayAnimatedStyle]}>
            <View style={styles.flippedContent}>
              <ThemedText
                fontSize={16}
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
          </Animated.View>
        </View>
      </GestureContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  layeredView: {
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
    backgroundColor: "transparent",
  },
  shaderBackground: {
    position: "absolute",
    width: SHADER_SIZE,
    height: SHADER_SIZE,
    borderRadius: BORDER_RADIUS,
    overflow: "hidden",
    top: SHADER_OFFSET,
    left: SHADER_OFFSET,
    borderWidth: 2,
    borderColor: theme.colorBlack,
  },
  logoOverlay: {
    position: "absolute",
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    resizeMode: "contain",
    top: LOGO_OFFSET,
    left: LOGO_OFFSET,
  },
  cardSide: {
    position: "absolute",
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    justifyContent: "center",
    alignItems: "center",
  },
  flippedOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
  },
  flippedContent: {
    backgroundColor: theme.colorBlack,
    height: FLIPPED_CONTENT_SIZE,
    width: FLIPPED_CONTENT_SIZE,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },
});
