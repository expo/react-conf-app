import { useThemeColor } from "@/components/Themed";
import { TimeZoneSwitch } from "@/components/TimeZoneSwitch";
import { theme } from "@/theme";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Image } from "expo-image";
import { Stack } from "expo-router";
import { Platform, StyleSheet, useColorScheme } from "react-native";

const lightImageSource = require("@/assets/images/conf.png");
const darkImageSource = require("@/assets/images/conf-dark.png");

export default function Layout() {
  const tabBarBackgroundColor = useThemeColor(theme.color.background);
  const isDarkMode = useColorScheme() === "dark";
  const imageSource = isDarkMode ? darkImageSource : lightImageSource;
  return (
    <Stack
      screenOptions={{
        headerLargeTitle: true,
        headerLargeTitleShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: Platform.OS === "ios" ? "Calendar" : "",
          headerStyle: {
            backgroundColor: isLiquidGlassAvailable()
              ? "transparent"
              : tabBarBackgroundColor,
          },
          headerLeft: () => <Image source={imageSource} style={styles.image} />,
          headerRight: () => <TimeZoneSwitch />,
        }}
      />
    </Stack>
  );
}
const styles = StyleSheet.create({
  image: {
    height: 20,
    width: 72,
  },
});
