import FontAwesome6 from "@expo/vector-icons/build/FontAwesome6";
import { Image } from "expo-image";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import * as Linking from "expo-linking";
import { InfoSection } from "./InfoSection";
import { ThemedText, useThemeColor } from "./Themed";

import { theme } from "@/theme";

const venueAddress = "101 Montelago Blvd, Henderson, NV 89011, United States";
const venueName = "The Westin Lake Las Vegas Resort & Spa";

export function VenueInfo() {
  const { width } = useWindowDimensions();

  const hotelImageSize = width / 3;

  const onOpenVenue = () => {
    Linking.openURL(
      `https://www.google.com/maps?q=${venueName}, ${venueAddress}`,
    );
  };

  const iconColor = useThemeColor({
    light: theme.colorBlack,
    dark: theme.colorWhite,
  });

  return (
    <InfoSection title="Venue">
      <View style={styles.venueContainer}>
        <Image
          source={require("../assets/images/hotel.png")}
          style={{
            width: hotelImageSize,
            height: hotelImageSize,
            borderRadius: hotelImageSize,
          }}
        />
        <View style={styles.hotelName}>
          <ThemedText fontWeight="bold" fontSize={24}>
            The Westin Lake Las Vegas Resort & Spa
          </ThemedText>
        </View>
      </View>
      <Pressable style={styles.venueAddress} onPress={onOpenVenue}>
        <FontAwesome6 name="location-dot" size={24} color={iconColor} />
        <ThemedText style={styles.address}>{venueAddress}</ThemedText>
      </Pressable>
    </InfoSection>
  );
}

const styles = StyleSheet.create({
  venueContainer: {
    flexDirection: "row",
    marginBottom: theme.space24,
  },
  hotelName: {
    flex: 1,
    paddingLeft: theme.space12,
    justifyContent: "center",
  },
  venueAddress: {
    flexDirection: "row",
    marginHorizontal: theme.space24,
    alignItems: "center",
  },
  address: {
    marginLeft: theme.space24,
    flex: 1,
    textDecorationLine: "underline",
  },
});
