import * as Haptics from "expo-haptics";
import {
  AccessibilityState,
  GestureResponderEvent,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface TabBarButtonProps {
  icon: React.FC<{ color: string }>;
  onPress?: (e: GestureResponderEvent) => void;
  accessibilityState?: AccessibilityState;
  activeTintColor: string;
  inactiveTintColor: string;
}

export function TabBarButton({
  icon,
  onPress,
  accessibilityState,
  activeTintColor,
  inactiveTintColor,
}: TabBarButtonProps) {
  const focused = accessibilityState?.selected;
  const color = focused ? activeTintColor : inactiveTintColor;
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
        scale.value = withSpring(0.92);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[styles.pressable, animatedStyle]}
    >
      {icon({ color })}
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
