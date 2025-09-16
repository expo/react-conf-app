import Feather from "@expo/vector-icons/build/Feather";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import Octicons from "@expo/vector-icons/build/Octicons";
import MaterialCommunityIcons from "@expo/vector-icons/build/MaterialCommunityIcons";
import {
  Badge,
  Icon,
  Label,
  NativeTabs,
  VectorIcon,
} from "expo-router/unstable-native-tabs";
import React from "react";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { TabBarButton } from "@/components/TabBarButton";
import { ThemedText, useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { useBookmarkStore } from "@/store/bookmarkStore";
import { Platform } from "react-native";

export default function TabLayout() {
  const tabBarBackgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkestBlue,
  });

  const tabBarActiveTintColor = useThemeColor({
    light: theme.colorReactDarkBlue,
    dark: theme.colorWhite,
  });

  const tabBarInactiveTintColor = useThemeColor({
    light: theme.colorGrey,
    dark: `rgba(255, 255, 255, 0.35)`,
  });

  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  const hasBookmarks = bookmarks.length > 0;

  return (
    <NativeTabs
      tintColor={tabBarActiveTintColor}
      backgroundColor={tabBarBackgroundColor}
    >
      <NativeTabs.Trigger name="index">
        {Platform.select({
          ios: <Icon sf={"calendar"} />,
          android: (
            <Icon src={<VectorIcon family={Feather} name="calendar" />} />
          ),
        })}
        <Label>Calendar</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="bookmarks">
        {Platform.select({
          ios: <Icon sf={"bookmark"} />,
          android: (
            <Icon
              src={
                <VectorIcon family={MaterialCommunityIcons} name={"bookmark"} />
              }
            />
          ),
        })}
        <Label>Bookmarked</Label>
        {hasBookmarks && <Badge>{bookmarks.length.toString()}</Badge>}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="speakers" role="search">
        {Platform.select({
          ios: <Icon sf={"person.2"} />,
          android: (
            <Icon src={<VectorIcon family={Ionicons} name={"people"} />} />
          ),
        })}
        <Label>Speakers</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="info">
        {Platform.select({
          ios: <Icon sf={"info"} />,
          android: (
            <Icon src={<VectorIcon family={Octicons} name={"info"} />} />
          ),
        })}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}

const BookmarkIcon = ({ color }: { color: string }) => {
  const bookmarks = useBookmarkStore((state) => state.bookmarks);
  return (
    <MaterialCommunityIcons
      name={bookmarks.length ? "bookmark-check" : "bookmark"}
      size={24}
      color={color}
    />
  );
};
