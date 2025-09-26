import { Image } from "expo-image";
import { StyleSheet, View, ViewStyle } from "react-native";

import { theme } from "@/theme";
import { ThemedView } from "./Themed";

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
      style={[imageSize, styles.imageContainer, style]}
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
  imageContainer: {
    marginRight: theme.space12,
    borderRadius: 100,
    overflow: "hidden",
  },
  profileImage: {
    width: 50,
    height: 70,
    ...StyleSheet.absoluteFillObject,
  },
  imageSizeSmall: {
    width: 32,
    height: 32,
  },
  imageSizeMedium: {
    width: 60,
    height: 60,
  },
  imageSizeLarge: {
    width: 96,
    height: 96,
  },
  imageSizeExtraLarge: {
    width: 200,
    height: 200,
  },
  fallbackImage: {
    backgroundColor: theme.color.reactBlue.dark,
    justifyContent: "center",
    alignItems: "center",
  },
  reactLogoSizeMedium: {
    width: 30,
    height: 30,
  },
  reactLogoSizeLarge: {
    width: 50,
    height: 50,
  },
  reactLogoSizeExtraLarge: {
    width: 100,
    height: 100,
  },
});
