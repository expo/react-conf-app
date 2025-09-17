import { useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { Stack } from "expo-router";

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
          headerStyle: {
            backgroundColor: tabBarBackgroundColor,
          },
        }}
      />
    </Stack>
  );
}
