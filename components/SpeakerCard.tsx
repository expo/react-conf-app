import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { SpeakerImage } from "./SpeakerImage";
import { ThemedText, ThemedView, useThemeColor } from "./Themed";
import { theme } from "../theme";
import { Speaker } from "../types";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  speaker: Speaker;
};

export function SpeakerCard({ speaker }: Props) {
  const shadow = useThemeColor({ light: theme.dropShadow, dark: undefined });

  return (
    <Link
      push
      key={speaker.id}
      href={{
        pathname: "/speaker/[speaker]",
        params: { speaker: speaker.id },
      }}
      asChild
    >
      <TouchableOpacity activeOpacity={0.8}>
        <ThemedView
          style={[styles.speakerCard, shadow]}
          darkColor="rgba(255,255,255,0.15)"
          lightColor={theme.colorThemeLightGrey}
        >
          <View style={styles.speakerHeadline}>
            <SpeakerImage
              animated
              profilePicture={speaker.profilePicture}
              size="large"
            />
            <View style={styles.speakerDetail}>
              <ThemedText fontSize={20} fontWeight="bold">
                {speaker.fullName}
              </ThemedText>
              <ThemedText fontSize={16} marginBottom={theme.space8}>
                {speaker.tagLine}
              </ThemedText>
            </View>
          </View>
        </ThemedView>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  speakerCard: {
    flex: 1,
    padding: theme.space16,
    marginHorizontal: theme.space16,
    borderRadius: theme.borderRadius10,
  },
  speakerDetail: {
    flex: 1,
    justifyContent: "center",
  },
  speakerHeadline: {
    flex: 1,
    flexDirection: "row",
  },
});
