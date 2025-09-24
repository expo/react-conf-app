import { theme } from "@/theme";
import { Session } from "@/types";
import { useBookmark } from "@/hooks/useBookmark";
import { HeaderButton } from "./HeaderButtons/HeaderButton";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { useThemeColor } from "./Themed";

export function Bookmark({ session }: { session: Session }) {
  const { toggleBookmark, isBookmarked } = useBookmark();
  const tintColor = useThemeColor({
    light: theme.colorReactLightBlue,
    dark: theme.colorReactDarkBlue,
  });

  const handlePress = async () => {
    await toggleBookmark(session);
  };

  const bookmarked = isBookmarked(session.id);

  return (
    <HeaderButton
      buttonProps={{
        onPress: handlePress,
        variant: "glassProminent",
        color: tintColor,
      }}
      imageProps={{
        systemName: bookmarked ? "bookmark.fill" : "bookmark",
        size: isLiquidGlassAvailable() ? 16 : 24,
        modifiers: [frame({ height: 20, width: 10 })],
        color: isLiquidGlassAvailable() ? "white" : tintColor,
      }}
    />
  );
}
