import { ThemedText, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { Stack } from "expo-router";

export default function Layout() {
  const tabBarBackgroundColor = useThemeColor(theme.color.background);

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: tabBarBackgroundColor,
          },
          headerTitle: () => (
            <ThemedText fontSize={20} fontWeight="bold">
              Bookmarks
            </ThemedText>
          ),
        }}
      />
    </Stack>
  );
}
