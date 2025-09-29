import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { differenceInMinutes } from "date-fns";
import * as QuickActions from "expo-quick-actions";
import { usePathname, useRouter } from "expo-router";
import { Stack } from "expo-router/stack";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { Platform, useColorScheme } from "react-native";
import { setBackgroundColorAsync } from "expo-system-ui";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from "expo-notifications";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import * as SplashScreen from "expo-splash-screen";

import { theme } from "../theme";

import { ThemedText, useThemeColor } from "@/components/Themed";
import { useReactConfStore } from "@/store/reactConfStore";
import { useQuickActionCallback } from "@/utils/useQuickActionCallback";

SplashScreen.setOptions({
  duration: 300,
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

  // Keep the root view background color in sync with the current theme
  useEffect(() => {
    setBackgroundColorAsync(
      colorScheme === "dark"
        ? theme.color.background.dark
        : theme.color.background.light,
    );
  }, [colorScheme]);

  useEffect(() => {
    QuickActions.setItems([
      {
        title: "Back to the app",
        icon: Platform.OS === "ios" ? "symbol:square.stack.3d.up" : "layers",
        id: "0",
        params: { href: "/modal" },
      },
    ]);
  }, []);

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

  useQuickActionCallback((action) => {
    const href = action.params?.href;
    if (href && typeof href === "string") {
      router.navigate(href);
    }
  });

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
    <GestureHandlerRootView style={{ flex: 1 }}>
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
                    ? isLiquidGlassAvailable()
                      ? "formSheet"
                      : "modal"
                    : "modal",
                sheetGrabberVisible: true,
                sheetAllowedDetents: [0.9],
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
                    <ThemedText fontSize={24} fontWeight="bold">
                      {props.children}
                    </ThemedText>
                  ),
                  default: undefined,
                }),
              }}
            />
            <Stack.Screen
              name="modal"
              options={{
                presentation: "modal",

                title: "Modal",
                headerTitleAlign: "center",
                headerTitle: (props) => (
                  <ThemedText fontSize={24} fontWeight="bold">
                    {props.children}
                  </ThemedText>
                ),
                ...(colorScheme === "dark"
                  ? {
                      headerStyle: { backgroundColor: theme.colorBlack },
                      headerTitleStyle: { color: "white" },
                    }
                  : {}),
              }}
            />
          </Stack>
        </ThemeProvider>
      </ActionSheetProvider>
    </GestureHandlerRootView>
  );
}
