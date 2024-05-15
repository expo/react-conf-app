import { useNetInfo } from "@react-native-community/netinfo";
import { useEffect } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  interpolate,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText, ThemedView } from "./Themed";

import { theme } from "@/theme";

const minHeight = 0;

export function OfflineBanner() {
  const netinfo = useNetInfo();
  const insets = useSafeAreaInsets();
  const height = useSharedValue(0);

  const isOffline = netinfo.isInternetReachable === false;
  const maxHeight = 28 + insets.bottom / 2;

  useEffect(() => {
    if (isOffline) {
      height.value = withTiming(maxHeight);
    } else {
      height.value = withTiming(minHeight);
    }
  }, [isOffline, height, maxHeight]);

  const animatedStyle = useAnimatedStyle(() => ({
    height: height.value,
    marginTop: interpolate(
      height.value,
      [minHeight, maxHeight],
      [minHeight, -insets.bottom + theme.space4],
    ),
  }));

  return (
    <Animated.View style={animatedStyle}>
      <ThemedView
        lightColor={theme.colorWhite}
        darkColor={theme.colorDarkBlue}
        style={styles.container}
      >
        <ThemedView
          lightColor={theme.colorThemeGrey}
          darkColor="#000"
          style={styles.textContainer}
        >
          <ThemedText fontWeight="bold" fontSize={14}>
            App is offline
          </ThemedText>
        </ThemedView>
      </ThemedView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
  },
  textContainer: {
    alignItems: "center",
    paddingVertical: theme.space4,
  },
});
