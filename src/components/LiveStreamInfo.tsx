import { Button } from "./Button";
import { ThemedText, ThemedView, useThemeColor } from "./Themed";
import openWebBrowserAsync from "@/utils/openWebBrowserAsync";
import { StyleSheet, View } from "react-native";

import { theme } from "@/theme";

export function LiveStreamInfo() {
  const handlePress = () => {
    openWebBrowserAsync("https://conf.react.dev/#newsletter");
  };

  const borderColor = useThemeColor({
    light: theme.color.textSecondary.light,
    dark: theme.colorWhite,
  });
  return (
    <ThemedView style={styles.container} color={theme.color.backgroundElement}>
      <View style={[styles.liveStreamContainer, { borderColor }]}>
        <View
          style={[styles.liveStreamDot, { backgroundColor: borderColor }]}
        />
        <ThemedText
          fontWeight="semiBold"
          fontSize={theme.fontSize14}
          color={{
            light: theme.color.textSecondary.light,
            dark: theme.colorWhite,
          }}
        >
          Live Stream
        </ThemedText>
      </View>
      <ThemedText
        color={{
          light: theme.color.textSecondary.light,
          dark: theme.colorWhite,
        }}
        style={styles.text}
      >
        Join React Conf from anywhere with our free live stream access. Watch
        all the talks remotely.
      </ThemedText>
      <Button onPress={handlePress} title="Sign up" />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    borderRadius: theme.borderRadius32,
    marginBottom: theme.space16,
    marginHorizontal: theme.space16,
    padding: theme.space24,
  },
  liveStreamContainer: {
    alignItems: "center",
    borderRadius: theme.borderRadius32,
    borderWidth: 2,
    flexDirection: "row",
    gap: theme.space8,
    justifyContent: "center",
    marginBottom: theme.space16,
    paddingHorizontal: theme.space8,
    paddingVertical: theme.space4,
  },
  liveStreamDot: {
    borderRadius: theme.borderRadius32,
    height: 8,
    width: 8,
  },
  text: {
    marginBottom: theme.space24,
    textAlign: "center",
  },
});
