import { Image } from "expo-image";
import React from "react";
import { StyleSheet, View } from "react-native";
import Animated, {
  Extrapolation,
  SharedValue,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";

import { ThemedText, ThemedView, useThemeColor } from "./Themed";
import { theme } from "../theme";

import { COLLAPSED_HEADER, EXPANDED_HEADER, ROW_HEIGHT } from "@/consts";

const AnimatedImage = Animated.createAnimatedComponent(Image);

const interpolateHeader = (
  scrollOffset: SharedValue<number>,
  outputRange: number[],
) => {
  "worklet";
  return interpolate(
    scrollOffset.value,
    [COLLAPSED_HEADER, EXPANDED_HEADER],
    outputRange,
    Extrapolation.CLAMP,
  );
};

interface ReactConfHeaderProps {
  scrollOffset: SharedValue<number>;
}

export function ReactConfHeader({ scrollOffset }: ReactConfHeaderProps) {
  const tintColor = useThemeColor({
    light: theme.colorReactDarkBlue,
    dark: theme.colorReactLightBlue,
  });

  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolateHeader(scrollOffset, [0, -30]) },
      { scale: interpolateHeader(scrollOffset, [1, 0.6]) },
    ],
  }));

  const firstLineStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolateHeader(scrollOffset, [0, -45]) },
      { translateY: interpolateHeader(scrollOffset, [0, 13]) },
    ],
    fontSize: interpolateHeader(scrollOffset, [36, 24]),
  }));

  const secondLineStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolateHeader(scrollOffset, [0, 35]) },
      { translateY: interpolateHeader(scrollOffset, [0, -18]) },
    ],
  }));

  const headerStyle = useAnimatedStyle(() => ({
    height: interpolateHeader(scrollOffset, [
      EXPANDED_HEADER - ROW_HEIGHT,
      COLLAPSED_HEADER,
    ]),
  }));

  return (
    <ThemedView
      style={[styles.header, headerStyle]}
      color={theme.color.background}
      animated
    >
      <AnimatedImage
        priority="high"
        tintColor={tintColor}
        source={require("@/assets/images/react-logo.png")}
        style={[styles.reactImage, animatedLogoStyle]}
      />
      <View>
        <ThemedText
          fontSize={36}
          fontWeight="bold"
          style={[styles.logoText, firstLineStyle]}
          darkColor={theme.colorWhite}
          lightColor={theme.colorBlack}
          animated
        >
          REACT
        </ThemedText>
        <ThemedText
          fontSize={24}
          style={[styles.logoText, secondLineStyle]}
          animated
        >
          CONF 2024
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  reactImage: {
    width: 75,
    height: 75,
  },
  logoText: {
    paddingStart: theme.space8,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginHorizontal: theme.space8,
  },
});
