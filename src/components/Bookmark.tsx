import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { Pressable } from "react-native-gesture-handler";

import { theme } from "@/theme";
import { Session } from "@/types";
import { useBookmark } from "@/hooks/useBookmark";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function Bookmark({ session }: { session: Session }) {
  const { toggleBookmark, isBookmarked } = useBookmark();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePress = async () => {
    await toggleBookmark(session);
  };

  const bookmarked = isBookmarked(session.id);

  return (
    <AnimatedPressable
      hitSlop={20}
      onPress={handlePress}
      onPressIn={() => {
        scale.value = withTiming(0.8);
      }}
      onPressOut={() => {
        scale.value = withTiming(1);
      }}
      style={animatedStyle}
    >
      <MaterialCommunityIcons
        name={bookmarked ? "bookmark" : "bookmark-outline"}
        size={28}
        color={bookmarked ? theme.color.reactBlue.light : theme.colorGrey}
      />
    </AnimatedPressable>
  );
}
