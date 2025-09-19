import { ThemedText, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { Stack, useRouter } from "expo-router";

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
            backgroundColor: tabBarBackgroundColor,
          },
          headerTitle: () => (
            <ThemedText fontSize={20} fontWeight="bold">
              Speakers
            </ThemedText>
          ),

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
