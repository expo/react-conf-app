import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";

import { theme } from "@/theme";
import { Session } from "@/types";
import { useBookmark } from "@/hooks/useBookmark";
import { SymbolView } from "expo-symbols";
import { StyleSheet } from "react-native";

export function BaseBookmark({
  session,
  size = "large",
}: {
  session: Session;
  size?: "small" | "large";
}) {
  const { toggleBookmark, isBookmarked } = useBookmark();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = async () => {
    scale.value = withSequence(
      withTiming(0.8, { duration: 100 }),
      withTiming(1, { duration: 100 }),
    );
    await toggleBookmark(session);
  };

  const tapGesture = Gesture.Tap()
    .onStart(() => {
      handlePress();
    })
    .runOnJS(true);

  const bookmarked = isBookmarked(session.id);
  const bookmarkColor = bookmarked
    ? theme.color.reactBlue.light
    : theme.colorGrey;

  return (
    <GestureDetector gesture={tapGesture}>
      <Animated.View style={[styles.container, animatedStyle]}>
        <SymbolView
          name={bookmarked ? "bookmark.fill" : "bookmark"}
          tintColor={bookmarkColor}
          fallback={
            <MaterialCommunityIcons
              name={bookmarked ? "bookmark" : "bookmark-outline"}
              size={theme.fontSize28}
              color={bookmarkColor}
            />
          }
        />
      </Animated.View>
    </GestureDetector>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: -theme.space8,
    padding: theme.space8,
  },
});
