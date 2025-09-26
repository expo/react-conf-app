import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Image } from "expo-image";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedText, ThemedView, useThemeColor } from "./Themed";

import { theme } from "@/theme";

const venueAddress = "101 Montelago Blvd, Henderson, NV 89011";
const venueName = "The Westin Lake Las Vegas Resort & Spa";

const BOTTOM_OFFSET = 50;

export function VenueInfo() {
  const { width } = useWindowDimensions();

  const hotelImageSize = width - theme.space24 * 2;

  const onOpenVenue = () => {
    Linking.openURL(
      `https://www.google.com/maps?q=${venueName}, ${venueAddress}`,
    );
  };

  const iconColor = useThemeColor(theme.color.textSecondary);

  const backgroundColor = useThemeColor(theme.color.backgroundElement);

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.imageContainer}>
          <Image
            source={require("@/assets/images/hotel.png")}
            style={{ width: hotelImageSize, height: hotelImageSize }}
          />
        </View>
        <LinearGradient
          locations={[0.4, 0.7]}
          start={{ x: 0.5, y: 0 }}
          end={{ x: 0.5, y: 1 }}
          colors={["transparent", backgroundColor]}
          style={[StyleSheet.absoluteFillObject]}
        />
        <ThemedView
          style={styles.venueDetails}
          color={theme.color.backgroundElement}
        >
          <ThemedText fontSize={16} color={theme.color.textSecondary}>
            Venue
          </ThemedText>
          <View style={styles.venueName}>
            <ThemedText fontSize={18} fontWeight="semiBold">
              The Westin Lake
            </ThemedText>
            <ThemedText fontSize={18} fontWeight="semiBold">
              Las Vegas Resort & Spa
            </ThemedText>
          </View>
          <Pressable style={styles.venueAddress} onPress={onOpenVenue}>
            <MaterialCommunityIcons
              name="map-marker-radius"
              size={18}
              color={iconColor}
            />
            <ThemedText color={theme.color.textSecondary} fontSize={14}>
              {venueAddress}
            </ThemedText>
          </Pressable>
        </ThemedView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.space16,
    paddingTop: theme.space24,
    paddingBottom: theme.space16,
    marginBottom: BOTTOM_OFFSET,
  },
  imageContainer: {
    borderTopLeftRadius: theme.borderRadius32,
    borderTopRightRadius: theme.borderRadius32,
    overflow: "hidden",
  },
  venueName: {
    marginBottom: theme.space16,
  },
  venueDetails: {
    position: "absolute",
    bottom: -BOTTOM_OFFSET,
    left: 0,
    right: 0,
    alignItems: "center",
    paddingBottom: theme.space24,
    borderBottomLeftRadius: theme.borderRadius32,
    borderBottomRightRadius: theme.borderRadius32,
  },
  venueAddress: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
  },
});
