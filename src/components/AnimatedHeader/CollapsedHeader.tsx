import { StyleSheet, useColorScheme, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  SharedValue,
  useAnimatedStyle,
  interpolate,
  Extrapolation,
} from "react-native-reanimated";
import { theme } from "@/theme";
import { Image } from "expo-image";

const lightImageSource = require("@/assets/images/header-collapsed.png");
const darkImageSource = require("@/assets/images/header-collapsed-dark.png");

type CollapsedHeaderProps = {
  scrollOffset: SharedValue<number>;
};

export function CollapsedHeader({ scrollOffset }: CollapsedHeaderProps) {
  const insets = useSafeAreaInsets();
  const isDarkMode = useColorScheme() === "dark";
  const imageSource = isDarkMode ? darkImageSource : lightImageSource;

  const animatedStyle = useAnimatedStyle(() => {
    const opacity = interpolate(
      scrollOffset.value,
      [400, 600],
      [0, 1],
      Extrapolation.CLAMP,
    );

    return {
      opacity,
    };
  });
  return (
    <Animated.View style={[styles.container, { paddingTop: insets.top }]}>
      <Animated.View style={animatedStyle}>
        <View style={styles.headerCollapsed}>
          <Image source={imageSource} style={styles.image} />
        </View>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  headerCollapsed: {
    paddingHorizontal: theme.space24,
  },
  image: {
    width: 72,
    height: 20,
  },
});
