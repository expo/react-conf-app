import Feather from "@expo/vector-icons/build/Feather";
import Ionicons from "@expo/vector-icons/build/Ionicons";
import { Image } from "expo-image";
import {
  useLocalSearchParams,
  Stack,
  useIsPreview,
  useRouter,
} from "expo-router";
import { Platform, StyleSheet, View } from "react-native";
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
import { HeaderButton } from "@/components/HeaderButtons/HeaderButton";
import { osName } from "expo-device";

export default function SpeakerDetail() {
  const params = useLocalSearchParams();
  const speakers = useReactConfStore((state) => state.allSessions.speakers);
  const speaker = speakers.find((speaker) => speaker.id === params.speakerId);
  const isPreview = useIsPreview();
  const router = useRouter();

  const secondaryColor = useThemeColor(theme.color.textSecondary);
  const borderColor = useThemeColor(theme.color.border);
  const backgroundColorSecondary = useThemeColor(
    theme.color.backgroundSecondary,
  );

  return (
    <>
      {!isPreview ? (
        <Stack.Screen
          options={{
            title: "",
            headerLeft: () =>
              Platform.select({
                ios: (
                  <HeaderButton
                    buttonProps={{ onPress: router.back }}
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{ padding: osName === "iPadOS" ? 40 : 0 }}
                  />
                ),
                default: undefined,
              }),
          }}
        />
      ) : null}
      <ThemedView
        style={styles.container}
        color={{
          light: theme.color.background.light,
          dark: isPreview
            ? backgroundColorSecondary
            : theme.color.background.dark,
        }}
      >
        {speaker ? (
          <ScrollView
            style={styles.container}
            contentContainerStyle={styles.contentContainer}
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.centered}>
              <SpeakerImage
                style={styles.speakerImage}
                profilePicture={speaker.profilePicture}
                size="large"
              />
              <ThemedText fontSize={theme.fontSize18} fontWeight="medium">
                {speaker.fullName}
              </ThemedText>
              {speaker.tagLine ? (
                <ThemedText
                  fontSize={theme.fontSize16}
                  fontWeight="medium"
                  color={{ light: secondaryColor, dark: secondaryColor }}
                  style={styles.tagLine}
                >
                  {speaker.tagLine}
                </ThemedText>
              ) : null}

              <View
                style={[styles.separator, { borderBottomColor: borderColor }]}
              />
            </View>
            {speaker.links.length ? <Socials speaker={speaker} /> : null}
            {speaker.bio ? (
              <ThemedText
                fontSize={theme.fontSize14}
                fontWeight="medium"
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
    </>
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
                  source={require("@/assets/images/x.svg")}
                  style={styles.icon}
                  tintColor={iconColor}
                />
              );
            }
            case "LinkedIn": {
              return (
                <Image
                  source={require("@/assets/images/linkedin.svg")}
                  style={styles.icon}
                  tintColor={iconColor}
                />
              );
            }
            case "Blog": {
              return (
                <Ionicons
                  name="reader"
                  size={theme.fontSize18}
                  color={iconColor}
                  style={styles.icon}
                />
              );
            }
            case "Company_Website": {
              return (
                <Feather
                  name="link"
                  size={theme.fontSize18}
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
  centered: {
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    borderBottomLeftRadius: theme.borderRadius20,
    borderBottomRightRadius: theme.borderRadius20,
    padding: theme.space16,
    paddingTop: theme.space24,
  },
  icon: {
    height: theme.fontSize20,
    width: theme.fontSize20,
  },
  separator: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginVertical: theme.space24,
    width: "100%",
  },
  socials: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: theme.space24,
  },
  speakerImage: {
    marginBottom: theme.space24,
  },
  tagLine: {
    textAlign: "center",
  },
});
