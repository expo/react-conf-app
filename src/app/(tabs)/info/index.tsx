import { useScrollToTop } from "@react-navigation/native";
import React from "react";
import { Platform } from "react-native";

import { BuildDetails } from "@/components/BuildDetails";
import { LiveStreamInfo } from "@/components/LiveStreamInfo";
import { DiscordInfo } from "@/components/DiscordInfo";
import { useThemeColor } from "@/components/Themed";
import { VenueInfo } from "@/components/VenueInfo";
import { theme } from "@/theme";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import { Link } from "expo-router";
import { PoweredByExpo2 } from "@/components/PoweredByExpo2";

export default function Info() {
  const backgroundColor = useThemeColor(theme.color.background);
  const ref = React.useRef(null);
  useScrollToTop(ref);

  return (
    <ScrollView
      style={{ backgroundColor }}
      ref={ref}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingBottom: Platform.select({ android: 100, default: 0 }),
      }}
    >
      <VenueInfo />
      <LiveStreamInfo />
      <DiscordInfo />
      <Link asChild href="/secretModal">
        <Pressable>
          <BuildDetails />
        </Pressable>
      </Link>
      <PoweredByExpo2 />
    </ScrollView>
  );
}
