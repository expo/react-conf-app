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

const CONTAINER_SIZE = 260;
const SHADER_SIZE = 200;
const LOGO_SIZE = 150;

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

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <View style={styles.container}>
      <GestureContainer
        width={CONTAINER_SIZE}
        height={CONTAINER_SIZE}
        maxAngle={15}
        onFlip={handleFlip}
      >
        <View style={styles.layeredView}>
          <View style={[styles.cardSide, !isFlipped && styles.cardSideVisible]}>
            <View style={styles.shaderBackground}>
              <HolographicGradient />
            </View>
            <Image
              source={require("@/assets/images/sub-expo.png")}
              style={styles.logoOverlay}
            />
          </View>
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
    experimental_backgroundImage:
      "linear-gradient(45deg, #CABBF3 0%, #D9E7D5 33%, #FDE1CB 66%, #FEF5F000 100%)",
  },
  logoOverlay: {
    position: "absolute",
    width: LOGO_SIZE,
    height: LOGO_SIZE,
    resizeMode: "contain",
    zIndex: 2,
    top: LOGO_OFFSET,
    left: LOGO_OFFSET,
  },
  cardSide: {
    position: "absolute",
    width: CONTAINER_SIZE,
    height: CONTAINER_SIZE,
    justifyContent: "center",
    alignItems: "center",
    backfaceVisibility: "hidden",
  },
  cardSideVisible: {},
});
