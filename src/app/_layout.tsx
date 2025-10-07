import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { differenceInMinutes } from "date-fns";
import { usePathname, useRouter } from "expo-router";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import * as NavigationBar from "expo-navigation-bar";
import { useEffect } from "react";
import { Platform, StyleSheet, useColorScheme } from "react-native";
import { setBackgroundColorAsync } from "expo-system-ui";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import * as SplashScreen from "expo-splash-screen";

import { theme } from "../theme";

import { ThemedText, useThemeColor } from "@/components/Themed";
import { useReactConfStore } from "@/store/reactConfStore";
import { osName } from "expo-device";

SplashScreen.setOptions({
  duration: 200,
  fade: true,
});

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function Layout() {
  const router = useRouter();
  const pathName = usePathname();
  const colorScheme = useColorScheme() || "light";

  const { refreshData, lastRefreshed } = useReactConfStore();

  const tabBarBackgroundColor = useThemeColor(theme.color.background);

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setButtonStyleAsync(
        colorScheme === "light" ? "dark" : "light",
      );
    }
  }, [colorScheme]);

  // Keep the root view background color in sync with the current theme
  useEffect(() => {
    setBackgroundColorAsync(
      colorScheme === "dark"
        ? theme.color.background.dark
        : theme.color.background.light,
    );
  }, [colorScheme]);

  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.actionIdentifier ===
        Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      try {
        const url = lastNotificationResponse.notification.request.content.data
          .url as string;
        if (url && pathName !== url) {
          router.push(url);
        }
      } catch {}
    }
    // eslint-disable-next-line react-compiler/react-compiler
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lastNotificationResponse]);

  useEffect(() => {
    const fetchData = async () => {
      if (
        !lastRefreshed ||
        differenceInMinutes(new Date(), new Date(lastRefreshed)) > 5
      ) {
        await refreshData();
      }
    };

    fetchData();
  }, [lastRefreshed, refreshData]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <ActionSheetProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />

          <Stack>
            <Stack.Screen
              name="(tabs)"
              options={{
                headerShown: false,
              }}
            />
            <Stack.Screen
              name="talk/[talkId]"
              options={{
                headerTransparent: Platform.OS === "ios" ? true : false,
                headerLargeTitle: false,
                title: "",
                presentation:
                  Platform.OS === "ios"
                    ? isLiquidGlassAvailable() && osName !== "iPadOS"
                      ? "formSheet"
                      : "modal"
                    : "modal",
                sheetGrabberVisible: true,
                sheetAllowedDetents: [0.8],
                sheetInitialDetentIndex: 0,
                contentStyle: {
                  backgroundColor: isLiquidGlassAvailable()
                    ? "transparent"
                    : tabBarBackgroundColor,
                },
                headerStyle: {
                  backgroundColor:
                    Platform.OS === "ios"
                      ? "transparent"
                      : tabBarBackgroundColor,
                },
                headerBlurEffect: isLiquidGlassAvailable()
                  ? undefined
                  : colorScheme === "dark"
                    ? "dark"
                    : "light",
              }}
            />
            <Stack.Screen
              name="speaker/[speakerId]"
              options={{
                presentation: "modal",
                headerStyle: {
                  backgroundColor:
                    Platform.OS === "ios"
                      ? "transparent"
                      : tabBarBackgroundColor,
                },
                headerTransparent: Platform.OS === "ios" ? true : false,
                headerTitleAlign: "center",
                headerBlurEffect: isLiquidGlassAvailable()
                  ? undefined
                  : colorScheme === "dark"
                    ? "dark"
                    : "light",
                headerTitle: Platform.select({
                  android: (props) => (
                    <ThemedText fontSize={theme.fontSize24} fontWeight="bold">
                      {props.children}
                    </ThemedText>
                  ),
                  default: undefined,
                }),
              }}
            />
          </Stack>
        </ThemeProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
