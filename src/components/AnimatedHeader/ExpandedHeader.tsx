import { theme } from "@/theme";
import { Image } from "expo-image";
import { useColorScheme, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const imageSource = require("@/assets/images/header-expanded.png");
const darkImageSource = require("@/assets/images/header-expanded-dark.png");

export function ExpandedHeader() {
  const isDarkMode = useColorScheme() === "dark";
  const insets = useSafeAreaInsets();
  return (
    <Image
      source={isDarkMode ? darkImageSource : imageSource}
      style={[styles.headerImage, { marginTop: -insets.top }]}
    />
  );
}

const styles = StyleSheet.create({
  headerImage: {
    height: 600,
    marginBottom: theme.space24,
  },
});
