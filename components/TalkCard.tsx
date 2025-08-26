import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Bookmark } from "./Bookmark";
import { SpeakerImage } from "./SpeakerImage";
import { ThemedText, ThemedView, useThemeColor } from "./Themed";
import { theme } from "../theme";
import { Session, Speaker } from "../types";
import { formatSessionTime } from "../utils/formatDate";

import { useReactConfStore } from "@/store/reactConfStore";
import { Pressable } from "react-native-gesture-handler";

type Props = {
  session: Session;
  isDayOne: boolean;
};

export function TalkCard({ session, isDayOne }: Props) {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);

  const shadow = useThemeColor({ light: theme.dropShadow, dark: undefined });

  return (
    <Link
      push
      href={{
        pathname: "/talk/[talk]",
        params: { talk: session.id },
      }}
      asChild
    >
      <Pressable>
        <ThemedView
          lightColor={theme.colorWhite}
          darkColor={theme.colorBlack}
          style={[styles.container, shadow]}
        >
          <ThemedView
            lightColor={
              isDayOne ? theme.colorReactLightBlue : theme.colorLightGreen
            }
            darkColor={
              isDayOne ? "rgba(88,196,220, 0.5)" : "rgba(155,223,177, 0.5)"
            }
            style={styles.heading}
          >
            <View style={styles.timeAndBookmark}>
              <ThemedText fontSize={18} fontWeight="medium">
                {formatSessionTime(session, shouldUseLocalTz)}
              </ThemedText>
              <Bookmark session={session} />
            </View>
            <ThemedText
              fontSize={20}
              fontWeight="bold"
              marginBottom={theme.space12}
            >
              {session.title}
            </ThemedText>
          </ThemedView>
          <ThemedView
            style={styles.content}
            lightColor={
              isDayOne ? "rgba(88,196,220, 0.15)" : "rgba(155,223,177, 0.15)"
            }
            darkColor={
              isDayOne ? "rgba(88,196,220, 0.15)" : "rgba(155,223,177, 0.15)"
            }
          >
            {session.speakers.map((speaker) => (
              <SpeakerDetails speaker={speaker} key={speaker.id} />
            ))}
          </ThemedView>
        </ThemedView>
      </Pressable>
    </Link>
  );
}

function SpeakerDetails({ speaker }: { speaker: Speaker }) {
  return (
    <View style={styles.speaker}>
      <SpeakerImage profilePicture={speaker.profilePicture} animated />
      <View style={styles.speakerDetails}>
        <ThemedText fontSize={18} fontWeight="bold">
          {speaker.fullName}
        </ThemedText>
        <ThemedText fontSize={16} fontWeight="medium">
          {speaker.tagLine}
        </ThemedText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.space16,
    marginBottom: theme.space16,
    borderRadius: theme.borderRadius10,
  },
  heading: {
    borderTopRightRadius: theme.borderRadius10,
    borderTopLeftRadius: theme.borderRadius10,
    paddingHorizontal: theme.space12,
    paddingTop: theme.space12,
  },
  speaker: {
    flexDirection: "row",
    marginBottom: theme.space12,
  },
  speakerDetails: {
    flex: 1,
    justifyContent: "center",
  },
  content: {
    paddingTop: theme.space12,
    paddingHorizontal: theme.space12,
    borderBottomRightRadius: theme.borderRadius10,
    borderBottomLeftRadius: theme.borderRadius10,
  },
  timeAndBookmark: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
