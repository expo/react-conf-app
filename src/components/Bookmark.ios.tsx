import { theme } from "@/theme";
import { Session } from "@/types";
import { useBookmark } from "@/hooks/useBookmark";
import { HeaderButton } from "./HeaderButtons/HeaderButton";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useThemeColor } from "./Themed";
import * as Haptics from "expo-haptics";
import { Platform, StyleProp, useColorScheme, ViewStyle } from "react-native";
import { useMemo } from "react";
import { BaseBookmark } from "./BaseBookmark";

type BookmarkProps = {
  session: Session;
  size?: "small" | "large";
  style?: StyleProp<ViewStyle>;
};

export function Bookmark(props: BookmarkProps) {
  if (isLiquidGlassAvailable()) {
    return <GlassBookmark {...props} />;
  }
  return <BaseBookmark {...props} />;
}

function GlassBookmark({ session, size = "large", style }: BookmarkProps) {
  const { toggleBookmark, isBookmarked } = useBookmark();
  const tintColor = useThemeColor(theme.color.reactBlue);
  const notSelectedIconColor = useThemeColor({
    dark: theme.colorWhite,
    light: theme.colorGrey,
  });
  const colorScheme = useColorScheme();

  const handlePress = async () => {
    if (Platform.OS === "ios") {
      if (isBookmarked(session.id)) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      }
    }

    await toggleBookmark(session);
  };

  const bookmarked = isBookmarked(session.id);
  const backgroundColor = useThemeColor({
    light: theme.color.background.light,
    dark: "#646469",
  });

  const imageColor = useMemo(() => {
    if (isLiquidGlassAvailable()) {
      return bookmarked ? theme.colorWhite : notSelectedIconColor;
    }
    return tintColor;
  }, [tintColor, bookmarked, notSelectedIconColor]);

  return (
    <HeaderButton
      buttonProps={{
        onPress: handlePress,
        variant: "glassProminent",
        color: colorScheme === "dark" ? "transparent" : backgroundColor,
      }}
      style={style}
      imageProps={{
        systemName: bookmarked ? "bookmark.fill" : "bookmark",
        color: bookmarked ? tintColor : imageColor,
        ...(size === "small" && {
          size: isLiquidGlassAvailable() ? 16 : 24,
          modifiers: [frame({ height: 20, width: 10 })],
        }),
      }}
    />
  );
}
