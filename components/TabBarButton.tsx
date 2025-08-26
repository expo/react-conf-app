import * as Haptics from "expo-haptics";
import {
  AccessibilityState,
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import { PropsWithChildren } from "react";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TabBarButtonProps {
  onPress?: (e: GestureResponderEvent) => void;
  accessibilityState?: AccessibilityState;
}

export function TabBarButton({
  onPress,
  children,
}: PropsWithChildren<TabBarButtonProps>) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={(e) => {
        if (Platform.OS !== "web") {
          Haptics.selectionAsync();
        }
        onPress?.(e);
      }}
      onPressIn={() => {
        // eslint-disable-next-line react-compiler/react-compiler
        scale.value = withSpring(0.92);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[styles.pressable, animatedStyle]}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
