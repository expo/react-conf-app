import { StyleSheet, View } from "react-native";

import { SpeakerImage } from "./SpeakerImage";
import { ThemedText } from "./Themed";
import { theme } from "../theme";
import { Speaker } from "../types";

export function SpeakerDetails({ speaker }: { speaker: Speaker }) {
  return (
    <View style={styles.speaker}>
      <SpeakerImage
        profilePicture={speaker.profilePicture}
        animated
        size="small"
      />
      <View style={styles.speakerDetails}>
        <ThemedText fontSize={16} fontWeight="semiBold">
          {speaker.fullName}
        </ThemedText>
        <ThemedText
          fontSize={14}
          fontWeight="medium"
          color={theme.color.textSecondary}
        >
          {speaker.tagLine}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  speaker: {
    flexDirection: "row",
    alignItems: "center",
  },
  speakerDetails: {
    flex: 1,
    justifyContent: "center",
  },
});
