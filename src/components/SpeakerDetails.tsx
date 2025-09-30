import { StyleSheet, View } from "react-native";

import { SpeakerImage } from "./SpeakerImage";
import { ThemedText } from "./Themed";
import { theme } from "../theme";
import { Speaker } from "@/types";

export function SpeakerDetails({ speaker }: { speaker: Speaker }) {
  return (
    <View style={styles.speaker}>
      <SpeakerImage
        profilePicture={speaker.profilePicture}
        animated
        size="small"
      />
      <View style={styles.speakerDetails}>
        <ThemedText fontSize={theme.fontSize16}>{speaker.fullName}</ThemedText>
        {speaker.tagLine ? (
          <ThemedText
            fontSize={theme.fontSize14}
            fontWeight="medium"
            color={theme.color.textSecondary}
          >
            {speaker.tagLine}
          </ThemedText>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  speaker: {
    alignItems: "center",
    flexDirection: "row",
  },
  speakerDetails: {
    flex: 1,
    gap: theme.space2,
    justifyContent: "center",
  },
});
