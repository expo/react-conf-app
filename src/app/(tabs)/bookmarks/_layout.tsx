import { ThemedText, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function Layout() {
  const tabBarBackgroundColor = useThemeColor(theme.color.background);

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
          title: "Bookmarks",
          headerTitle: () =>
            Platform.OS === "android" ? (
              <ThemedText fontSize={theme.fontSize20} fontWeight="bold">
                Bookmarks
              </ThemedText>
            ) : undefined,

          headerStyle: {
            backgroundColor: isLiquidGlassAvailable()
              ? "transparent"
              : tabBarBackgroundColor,
          },
        }}
      />
    </Stack>
  );
}
