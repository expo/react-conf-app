import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Pressable } from "react-native-gesture-handler";

import { theme } from "@/theme";
import { Session } from "@/types";
import { useBookmark } from "@/hooks/useBookmark";
import { SymbolView } from "expo-symbols";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

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

  const bookmarked = isBookmarked(session.id);
  const bookmarkColor = bookmarked
    ? theme.color.reactBlue.light
    : theme.colorGrey;

  return (
    <AnimatedPressable hitSlop={20} onPress={handlePress} style={animatedStyle}>
      <SymbolView
        name={bookmarked ? "bookmark.fill" : "bookmark"}
        tintColor={bookmarkColor}
        fallback={
          <MaterialCommunityIcons
            name={bookmarked ? "bookmark" : "bookmark-outline"}
            size={28}
            color={bookmarkColor}
          />
        }
      />
    </AnimatedPressable>
  );
}
