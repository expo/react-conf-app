import { ThemedView } from "../Themed";
import { StyleSheet, useColorScheme } from "react-native";
import { theme } from "@/theme";
import { Image } from "expo-image";

const lightImageSource = require("@/assets/images/header-collapsed.png");
const darkImageSource = require("@/assets/images/header-collapsed-dark.png");

export function CollapsedHeader() {
  const isDarkMode = useColorScheme() === "dark";
  const imageSource = isDarkMode ? darkImageSource : lightImageSource;

  return (
    <ThemedView style={styles.headerCollapsed}>
      <Image source={imageSource} style={styles.image} />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  headerCollapsed: {
    paddingHorizontal: theme.space24,
  },
  image: {
    width: 72,
    height: 20,
  },
});
