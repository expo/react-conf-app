import Feather from "@expo/vector-icons/build/Feather";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Image } from "expo-image";
import { useNavigation, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";
import openWebBrowserAsync from "@/utils/openWebBrowserAsync";
import { ScrollView } from "react-native-gesture-handler";

import { IconButton } from "@/components/IconButton";
import { MiniTalkCard } from "@/components/MiniTalkCard";
import { NotFound } from "@/components/NotFound";
import { SpeakerImage } from "@/components/SpeakerImage";
import { ThemedText, ThemedView, useThemeColor } from "@/components/Themed";
import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { Speaker } from "@/types";

export default function SpeakerDetail() {
  const params = useLocalSearchParams();
  const speakers = useReactConfStore((state) => state.allSessions.speakers);
  const speaker = speakers.find((speaker) => speaker.id === params.speakerId);
  const navigation = useNavigation();

  useEffect(() => {
    navigation.setOptions({ title: speaker?.fullName });
  }, [speaker, navigation]);

  return (
    <ThemedView style={styles.container} color={theme.color.background}>
      {speaker ? (
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainer}
        >
          <View style={styles.centered}>
            <SpeakerImage
              style={styles.speakerImage}
              profilePicture={speaker.profilePicture}
              size="xlarge"
            />
            {speaker.tagLine ? (
              <ThemedText
                fontSize={theme.fontSize18}
                fontWeight="medium"
                style={styles.tagLine}
                italic
              >
                {speaker.tagLine}
              </ThemedText>
            ) : null}
          </View>
          {speaker.links.length ? <Socials speaker={speaker} /> : null}
          {speaker.bio ? (
            <ThemedText
              fontSize={theme.fontSize18}
              style={{
                marginBottom: theme.space24,
                lineHeight: theme.fontSize18 * 1.5,
              }}
            >
              {speaker.bio}
            </ThemedText>
          ) : null}
          {speaker.sessions.map((sessionId) => (
            <MiniTalkCard sessionId={sessionId} key={sessionId} />
          ))}
        </ScrollView>
      ) : (
        <NotFound message="Speaker not found" />
      )}
    </ThemedView>
  );
}

function Socials({ speaker }: { speaker: Speaker }) {
  const iconColor = useThemeColor({
    light: theme.colorBlack,
    dark: theme.colorWhite,
  });
  return (
    <View style={styles.socials}>
      {speaker.links.map((link) => {
        const icon = (() => {
          switch (link.linkType) {
            case "Twitter": {
              return (
                <Image
                  source={require("../../assets/images/x.svg")}
                  style={styles.icon}
                  tintColor={iconColor}
                />
              );
            }
            case "LinkedIn": {
              return (
                <Image
                  source={require("../../assets/images/linkedin.svg")}
                  style={styles.icon}
                  tintColor={iconColor}
                />
              );
            }
            case "Blog": {
              return (
                <Ionicons
                  name="reader"
                  size={18}
                  color={iconColor}
                  style={styles.icon}
                />
              );
            }
            case "Company_Website": {
              return (
                <Feather
                  name="link"
                  size={18}
                  color={iconColor}
                  style={styles.icon}
                />
              );
            }
          }
        })();

        if (!icon) {
          return null;
        }

        return (
          <IconButton
            onPress={() => openWebBrowserAsync(link.url)}
            key={link.title}
          >
            {icon}
          </IconButton>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: theme.space16,
    paddingTop: theme.space24,
    borderBottomRightRadius: theme.borderRadius20,
    borderBottomLeftRadius: theme.borderRadius20,
  },
  centered: {
    alignItems: "center",
  },
  tagLine: {
    marginBottom: theme.space24,
  },
  speakerImage: {
    marginBottom: theme.space24,
  },
  icon: {
    height: 20,
    width: 20,
  },
  socials: {
    marginBottom: theme.space24,
    flexDirection: "row",
    justifyContent: "center",
  },
});
