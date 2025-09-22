import { Image } from "expo-image";
import { useColorScheme, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";

const imageSource = require("@/assets/images/header-expanded.png");
const darkImageSource = require("@/assets/images/header-expanded-dark.png");

interface ExpandedHeaderProps {
  scrollOffset: SharedValue<number>;
}

export function ExpandedHeader({ scrollOffset }: ExpandedHeaderProps) {
  const isDarkMode = useColorScheme() === "dark";

  const animatedImageStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollOffset.value,
      [0, 600],
      [600, 0],
      Extrapolation.CLAMP,
    );

    return {
      height,
    };
  });

  return (
    <Animated.View style={animatedImageStyle}>
      <Image
        source={isDarkMode ? darkImageSource : imageSource}
        style={[styles.headerImage]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    width: "100%",
    height: "100%",
  },
});
