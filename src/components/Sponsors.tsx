import { theme } from "@/theme";
import { Pressable, StyleSheet, View } from "react-native";
import { ThemedText, ThemedView } from "./Themed";
import { Image } from "expo-image";
import openWebBrowserAsync from "@/utils/openWebBrowserAsync";

const sponsors = {
  amazon: {
    image: require("@/assets/sponsors/platinum-amazon.svg"),
    url: "https://www.developer.amazon.com/",
  },
  agGrid: {
    image: require("@/assets/sponsors/gold-ag-grid.svg"),
    url: "https://www.ag-grid.com/",
  },
  mui: {
    image: require("@/assets/sponsors/gold-mui.svg"),
    url: "https://mui.com/",
  },
  resend: {
    image: require("@/assets/sponsors/gold-resend.svg"),
    url: "https://resend.com/",
  },
  revenueCat: {
    image: require("@/assets/sponsors/gold-revenue-cat.svg"),
    url: "https://www.revenuecat.com/",
  },
  vercel: {
    image: require("@/assets/sponsors/gold-vercel.svg"),
    url: "https://vercel.com/",
  },
  expo: {
    image: require("@/assets/sponsors/gold-expo.svg"),
    url: "https://expo.dev/",
  },
  redwood: {
    image: require("@/assets/sponsors/gold-redwood.svg"),
    url: "https://rwsdk.com/",
  },
  livestream: {
    image: require("@/assets/sponsors/livestream-mux.svg"),
    url: "https://www.mux.com/",
  },
  oldMission: {
    image: require("@/assets/sponsors/silver-old-mission.png"),
    url: "https://www.oldmissioncapital.com/",
  },
  arcjet: {
    image: require("@/assets/sponsors/silver-arcjet.svg"),
    url: "https://www.arcjet.com/",
  },
  meta: {
    image: require("@/assets/sponsors/organizer-meta.svg"),
    url: "https://www.meta.com/",
  },
  callstack: {
    image: require("@/assets/sponsors/organizer-callstack.svg"),
    url: "https://www.callstack.com/",
  },
  renderAtl: {
    image: require("@/assets/sponsors/silver-render-atl.png"),
    url: " https://www.renderatl.com/",
  },
  infiniteRed: {
    image: require("@/assets/sponsors/silver-infinite-red.svg"),
    url: "https://infinite.red/",
  },
};

type Sponsor = (typeof sponsors)[keyof typeof sponsors];

export function Sponsors() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText
        fontSize={theme.fontSize18}
        fontWeight="semiBold"
        style={styles.title}
      >
        Sponsors
      </ThemedText>
      <ThemedView style={styles.content} color={theme.color.backgroundElement}>
        <ThemedText color={theme.color.textSecondary} style={styles.level}>
          Platinum
        </ThemedText>
        <SponsorCard sponsor={sponsors.amazon} />
        <ThemedText color={theme.color.textSecondary} style={styles.level}>
          Gold
        </ThemedText>
        <View style={styles.sponsors}>
          <SponsorCard sponsor={sponsors.agGrid} />
          <SponsorCard sponsor={sponsors.mui} />
          <SponsorCard sponsor={sponsors.resend} />
          <SponsorCard sponsor={sponsors.revenueCat} />
          <SponsorCard sponsor={sponsors.vercel} />
          <SponsorCard sponsor={sponsors.expo} />
          <SponsorCard sponsor={sponsors.redwood} />
        </View>
        <ThemedText color={theme.color.textSecondary} style={styles.level}>
          Livestream
        </ThemedText>
        <SponsorCard sponsor={sponsors.livestream} />
        <ThemedText color={theme.color.textSecondary} style={styles.level}>
          Silver
        </ThemedText>
        <View style={styles.sponsors}>
          <SponsorCard sponsor={sponsors.oldMission} />
          <SponsorCard sponsor={sponsors.arcjet} />
          <SponsorCard sponsor={sponsors.renderAtl} />
          <SponsorCard sponsor={sponsors.infiniteRed} />
        </View>
        <ThemedText color={theme.color.textSecondary} style={styles.level}>
          Organizers
        </ThemedText>
        <View style={styles.sponsors}>
          <SponsorCard sponsor={sponsors.meta} />
          <SponsorCard sponsor={sponsors.callstack} />
        </View>
      </ThemedView>
    </ThemedView>
  );
}

function SponsorCard({ sponsor }: { sponsor: Sponsor }) {
  return (
    <Pressable
      style={styles.imageContainer}
      onPress={() => {
        openWebBrowserAsync(sponsor.url);
      }}
    >
      <Image source={sponsor.image} style={styles.image} contentFit="contain" />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.space24,
  },
  content: {
    paddingBottom: theme.space16,
    paddingHorizontal: theme.space16,
  },
  image: {
    height: 58,
  },
  imageContainer: {
    backgroundColor: theme.colorWhite,
    borderRadius: theme.borderRadius12,
    padding: theme.space8,
  },
  level: {
    paddingVertical: theme.space16,
  },
  sponsors: {
    gap: theme.space16,
  },
  title: {
    paddingBottom: theme.space16,
    paddingHorizontal: theme.space16,
  },
});
