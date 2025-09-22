import { StyleSheet, useColorScheme, View } from "react-native";
import { theme } from "@/theme";
import { Image } from "expo-image";
import { ThemedView } from "./Themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const lightImageSource = require("@/assets/images/header-collapsed.png");
const darkImageSource = require("@/assets/images/header-collapsed-dark.png");

export function HomeHeader() {
  const isDarkMode = useColorScheme() === "dark";
  const imageSource = isDarkMode ? darkImageSource : lightImageSource;
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container]}>
      <View style={{ paddingTop: insets.top }}>
        <Image source={imageSource} style={styles.image} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.space24,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  image: {
    width: 72,
    height: 20,
  },
});
