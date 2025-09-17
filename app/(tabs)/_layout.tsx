import Feather from "@expo/vector-icons/Feather";
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
import { ColorValue, ImageSourcePropType, Platform } from "react-native";

import { useThemeColor } from "@/components/Themed";
import { theme } from "@/theme";
import { useBookmarkStore } from "@/store/bookmarkStore";

// Todo (betomoedano): In the future we can remove this type. Learn more: https://exponent-internal.slack.com/archives/C0447EFTS74/p1758042759724779?thread_ts=1758039375.241799&cid=C0447EFTS74
type VectorIconFamily = {
  getImageSource: (
    name: string,
    size: number,
    // eslint-disable-next-line prettier/prettier
    color: ColorValue
  ) => Promise<ImageSourcePropType>;
};

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
      labelVisibilityMode="labeled"
      iconColor={tabBarInactiveTintColor}
      indicatorColor={tabBarActiveTintColor + "30"}
      disableTransparentOnScrollEdge={true} // Used to prevent transparent background on iOS 18 and older
    >
      <NativeTabs.Trigger name="index">
        {Platform.select({
          ios: <Icon sf={"calendar"} selectedColor={tabBarActiveTintColor} />,
          android: (
            <Icon
              src={
                <VectorIcon
                  family={Feather as VectorIconFamily}
                  name="calendar"
                />
              }
            />
          ),
        })}
        <Label>Calendar</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="bookmarks">
        {Platform.select({
          ios: <Icon sf={"bookmark"} selectedColor={tabBarActiveTintColor} />,
          android: (
            <Icon
              src={
                <VectorIcon
                  family={MaterialCommunityIcons as VectorIconFamily}
                  name={"bookmark"}
                />
              }
            />
          ),
        })}
        <Label>Bookmarked</Label>
        {hasBookmarks && <Badge>{bookmarks.length.toString()}</Badge>}
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="speakers" role="search">
        {Platform.select({
          ios: <Icon sf={"person.2"} selectedColor={tabBarActiveTintColor} />,
          android: (
            <Icon
              src={
                <VectorIcon
                  family={Ionicons as VectorIconFamily}
                  name={"people"}
                />
              }
            />
          ),
        })}
        <Label>Speakers</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="info">
        {Platform.select({
          ios: <Icon sf={"info"} selectedColor={tabBarActiveTintColor} />,
          android: (
            <Icon
              src={
                <VectorIcon
                  family={Octicons as VectorIconFamily}
                  name={"info"}
                />
              }
            />
          ),
        })}
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
