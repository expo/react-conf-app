import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import {
  Badge,
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import React from "react";
import {
  ColorValue,
  ImageSourcePropType,
  Platform,
  DynamicColorIOS,
} from "react-native";

import { theme } from "@/theme";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useThemeColor } from "@/components/Themed";

// Todo (betomoedano): In the future we can remove this type. Learn more: https://exponent-internal.slack.com/archives/C0447EFTS74/p1758042759724779?thread_ts=1758039375.241799&cid=C0447EFTS74
type VectorIconFamily = {
  getImageSource: (
    name: string,
    size: number,
    color: ColorValue,
  ) => Promise<ImageSourcePropType>;
};

export default function TabLayout() {
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const hasBookmarks = bookmarks.length > 0;
  const tintColor = useThemeColor(theme.color.reactBlue);
  const androidInactiveTintColor = useThemeColor({
    light: theme.colorGrey,
    dark: "#FFFFFF50",
  });
  const tabBarActiveTintColor = useThemeColor({
    light: theme.colorBlack,
    dark: theme.colorWhite,
  });

  return (
    <NativeTabs
      labelStyle={{
        color: Platform.OS === "ios" ? undefined : androidInactiveTintColor,
      }}
      iconColor={
        Platform.OS === "ios"
          ? DynamicColorIOS(theme.color.reactBlue)
          : androidInactiveTintColor
      }
      tintColor={
        Platform.OS === "ios"
          ? DynamicColorIOS(theme.color.reactBlue)
          : tabBarActiveTintColor
      }
      labelVisibilityMode="labeled"
      indicatorColor={tintColor + "25"}
      disableTransparentOnScrollEdge={true} // Used to prevent transparent background on iOS 18 and older
    >
      <NativeTabs.Trigger name="(calendar)">
        {Platform.select({
          ios: <Icon sf="calendar" />,
          android: (
            <Icon
              src={
                <VectorIcon
                  family={MaterialCommunityIcons as VectorIconFamily}
                  name="calendar-blank"
                />
              }
              selectedColor={tintColor}
            />
          ),
        })}
        <Label>Calendar</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="bookmarks">
        {Platform.select({
          ios: <Icon sf="bookmark" />,
          android: (
            <Icon
              src={
                <VectorIcon
                  family={MaterialCommunityIcons as VectorIconFamily}
                  name="bookmark"
                />
              }
              selectedColor={tintColor}
            />
          ),
        })}
        <Label>Bookmarked</Label>
        {hasBookmarks && !isLiquidGlassAvailable() && (
          <Badge selectedBackgroundColor={tintColor}>
            {bookmarks.length.toString()}
          </Badge>
        )}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger
        name="speakers"
        role={isLiquidGlassAvailable() ? "search" : undefined}
      >
        {Platform.select({
          ios: <Icon sf="person.2" />,
          android: (
            <Icon
              src={
                <VectorIcon
                  family={MaterialCommunityIcons as VectorIconFamily}
                  name="account-multiple"
                />
              }
              selectedColor={tintColor}
            />
          ),
        })}
        <Label>Speakers</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="info">
        {Platform.select({
          ios: <Icon sf="map" />,
          android: (
            <Icon
              src={
                <VectorIcon
                  family={MaterialCommunityIcons as VectorIconFamily}
                  name="map-outline"
                />
              }
              selectedColor={tintColor}
            />
          ),
        })}
        <Label>Info</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
