import { StyleSheet, useColorScheme, View } from "react-native";
import { theme } from "@/theme";
import { Image } from "expo-image";
import { ThemedView } from "./Themed";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TimeZoneSwitch } from "./TimeZoneSwitch";

const lightImageSource = require("@/assets/images/header-collapsed.png");
const darkImageSource = require("@/assets/images/header-collapsed-dark.png");

export function HomeHeader() {
  const isDarkMode = useColorScheme() === "dark";
  const imageSource = isDarkMode ? darkImageSource : lightImageSource;
  const insets = useSafeAreaInsets();

  return (
    <ThemedView style={[styles.container]}>
      <View style={[styles.hederInner, { paddingTop: insets.top }]}>
        <Image source={imageSource} style={styles.image} />
        <TimeZoneSwitch />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: theme.space24,
    paddingTop: theme.space12,
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
  hederInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  image: {
    width: 72,
    height: 20,
  },
});
