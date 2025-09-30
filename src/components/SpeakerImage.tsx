import { Image } from "expo-image";
import { StyleSheet, View, ViewStyle } from "react-native";

import { theme } from "@/theme";
import { ThemedView, useThemeColor } from "./Themed";

export function SpeakerImage({
  profilePicture,
  size,
  style,
  animated,
}: {
  profilePicture?: string | null;
  size?: "small" | "medium" | "large" | "xlarge";
  style?: ViewStyle;
  animated?: boolean;
}) {
  const borderColor = useThemeColor(theme.color.border);
  const imageSize = (() => {
    switch (size) {
      case "small":
        return styles.imageSizeSmall;
      case "large":
        return styles.imageSizeLarge;
      case "xlarge":
        return styles.imageSizeExtraLarge;
      case "medium":
      default:
        return styles.imageSizeMedium;
    }
  })();
  const imageStyles = [styles.profileImage, imageSize];

  const reactLogoSize = (() => {
    switch (size) {
      case "large":
        return styles.reactLogoSizeLarge;
      case "xlarge":
        return styles.reactLogoSizeExtraLarge;
      case "medium":
      default:
        return styles.reactLogoSizeMedium;
    }
  })();

  const placeholder = (
    <View style={[imageStyles, styles.fallbackImage]}>
      <Image
        source={require("@/assets/images/reactlogo-white.png")}
        style={reactLogoSize}
        cachePolicy={"disk"}
      />
    </View>
  );

  return (
    <ThemedView
      lightColor="rgba(255,255,255,0.15)"
      darkColor="rgba(0,0,0,0.15)"
      style={[imageSize, styles.imageContainer, style, { borderColor }]}
    >
      {profilePicture ? (
        <Image
          source={{ uri: profilePicture }}
          style={imageStyles}
          transition={animated ? 300 : 0}
        />
      ) : (
        placeholder
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  fallbackImage: {
    alignItems: "center",
    backgroundColor: theme.color.reactBlue.dark,
    justifyContent: "center",
  },
  imageContainer: {
    borderRadius: 100,
    borderWidth: 1,
    marginRight: theme.space12,
    overflow: "hidden",
  },
  imageSizeExtraLarge: {
    height: 200,
    width: 200,
  },
  imageSizeLarge: {
    height: 96,
    width: 96,
  },
  imageSizeMedium: {
    height: 60,
    width: 60,
  },
  imageSizeSmall: {
    height: 42,
    width: 42,
  },
  profileImage: {
    height: 70,
    width: 50,
    ...StyleSheet.absoluteFillObject,
  },
  reactLogoSizeExtraLarge: {
    height: 100,
    width: 100,
  },
  reactLogoSizeLarge: {
    height: 50,
    width: 50,
  },
  reactLogoSizeMedium: {
    height: 30,
    width: 30,
  },
});
