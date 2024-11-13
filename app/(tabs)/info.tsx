import { useScrollToTop } from "@react-navigation/native";
import React from "react";
import { StyleSheet } from "react-native";

import { BuildDetails } from "@/components/BuildDetails";
import { LiveStreamInfo } from "@/components/LiveStreamInfo";
import { OrganizersInfo } from "@/components/OrganizersInfo";
import { SponsorsInfo } from "@/components/SponsorsInfo";
import { DiscordInfo } from "@/components/DiscordInfo";
import { PoweredByExpo } from "@/components/PoweredByExpo";
import { ThemedView, useThemeColor } from "@/components/Themed";
import { VenueInfo } from "@/components/VenueInfo";
import { theme } from "@/theme";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { Link } from "expo-router";

export default function Info() {
  const backgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorDarkBlue,
  });
  const ref = React.useRef(null);
  useScrollToTop(ref);

  return (
    <ThemedView style={[styles.container, { backgroundColor }]}>
      <ScrollView style={styles.scrollView} ref={ref}>
        <VenueInfo />
        <LiveStreamInfo />
        <DiscordInfo />
        <SponsorsInfo />
        <OrganizersInfo />
        <Link asChild href="/secretModal">
          <Pressable>
            <BuildDetails />
          </Pressable>
        </Link>
        <PoweredByExpo />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
});
