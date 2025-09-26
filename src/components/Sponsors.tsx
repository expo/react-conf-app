import { theme } from "@/theme";
import { Pressable, StyleSheet } from "react-native";
import { ThemedText, ThemedView } from "./Themed";
import { Image } from "expo-image";
import openWebBrowserAsync from "@/utils/openWebBrowserAsync";

const sponsors = {
  amazon: {
    image: require("@/assets/sponsors/platinum-amazon.svg"),
    url: "https://www.developer.amazon.com/",
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
        <ThemedText
          color={theme.color.textSecondary}
          marginBottom={theme.space16}
        >
          Platinum
        </ThemedText>
        <SponsorCard sponsor={sponsors.amazon} />
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
      <Image source={sponsor.image} style={styles.image} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: theme.space24,
  },
  title: {
    paddingHorizontal: theme.space24,
    paddingBottom: theme.space16,
  },
  content: {
    paddingHorizontal: theme.space24,
    paddingVertical: theme.space16,
  },
  imageContainer: {
    backgroundColor: theme.colorWhite,
    borderRadius: theme.borderRadius12,
    padding: theme.space16,
  },
  image: {
    height: 50,
  },
});
