import { ThemedText, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { Stack, useRouter } from "expo-router";
import { Platform } from "react-native";

export default function Layout() {
  const router = useRouter();
  const tabBarBackgroundColor = useThemeColor(theme.color.background);
  const tabBarTintColor = useThemeColor({
    light: theme.colorBlack,
    dark: theme.colorWhite,
  });

  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerStyle: {
            backgroundColor: isLiquidGlassAvailable()
              ? "transparent"
              : tabBarBackgroundColor,
          },
          headerLargeTitle: true,
          title: "Speakers",
          headerTitle: () =>
            Platform.OS === "android" ? (
              <ThemedText fontSize={theme.fontSize20} fontWeight="bold">
                Speakers
              </ThemedText>
            ) : undefined,

          headerSearchBarOptions: {
            headerIconColor: tabBarTintColor,
            tintColor: tabBarTintColor,
            textColor: tabBarTintColor,
            hintTextColor: tabBarTintColor,
            placeholder: "Search speakers",
            onChangeText: (event) => {
              router.setParams({
                q: event.nativeEvent.text,
              });
            },
          },
        }}
      />
    </Stack>
  );
}
