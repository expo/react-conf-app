import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image, ImageStyle } from "expo-image";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText, ThemedView, useThemeColor } from "./Themed";

import { theme } from "@/theme";
import { osName } from "expo-device";

const venueAddress = "101 Montelago Blvd, Henderson, NV 89011";
const venueName = "The Westin Lake Las Vegas Resort & Spa";

const BOTTOM_OFFSET = 50;

export function VenueInfo() {
  const { width } = useWindowDimensions();
  const hotelImageSize = width - theme.space24;

  const imageStyle: ImageStyle =
    osName === "iPadOS"
      ? {
          width: hotelImageSize,
          height: hotelImageSize / 2,
        }
      : { width: "100%", aspectRatio: 1 };

  const onOpenVenue = () => {
    Linking.openURL(
      `https://www.google.com/maps?q=${venueName}, ${venueAddress}`,
    );
  };

  const iconColor = useThemeColor(theme.color.textSecondary);

  const backgroundColor = useThemeColor(theme.color.backgroundElement);

  return (
    <Pressable style={styles.container} onPress={onOpenVenue}>
      <View>
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/hotel.png")}
            style={imageStyle}
          />
        </View>
        <LinearGradient
          locations={[0.4, 0.7]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          colors={["transparent", backgroundColor]}
          style={StyleSheet.absoluteFillObject}
        />
        <ThemedView
          style={styles.venueDetails}
          color={theme.color.backgroundElement}
        >
          <ThemedText
            fontSize={theme.fontSize14}
            color={theme.color.textSecondary}
          >
            Venue
          </ThemedText>
          <View style={styles.venueName}>
            <ThemedText fontSize={theme.fontSize18} fontWeight="semiBold">
              The Westin Lake
            </ThemedText>
            <ThemedText fontSize={theme.fontSize18} fontWeight="semiBold">
              Las Vegas Resort & Spa
            </ThemedText>
          </View>
          <View style={styles.venueAddress}>
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={theme.fontSize16}
              color={iconColor}
            />
            <ThemedText
              color={theme.color.textSecondary}
              fontSize={theme.fontSize12}
            >
              {venueAddress}
            </ThemedText>
          </View>
        </ThemedView>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: BOTTOM_OFFSET,
    marginHorizontal: theme.space16,
    paddingBottom: theme.space16,
    paddingTop: theme.space24,
  },
  imageContainer: {
    borderTopLeftRadius: theme.borderRadius32,
    borderTopRightRadius: theme.borderRadius32,
    overflow: "hidden",
  },
  venueAddress: {
    alignItems: "center",
    flexDirection: "row",
    gap: 1,
    justifyContent: "center",
  },
  venueDetails: {
    alignItems: "center",
    borderBottomLeftRadius: theme.borderRadius32,
    borderBottomRightRadius: theme.borderRadius32,
    bottom: -BOTTOM_OFFSET,
    left: 0,
    paddingBottom: theme.space24,
    position: "absolute",
    right: 0,
  },
  venueName: {
    alignItems: "center",
    marginBottom: theme.space16,
  },
});
