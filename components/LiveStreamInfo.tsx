import { Button } from "./Button";
import { ThemedText, ThemedView, useThemeColor } from "./Themed";
import openWebBrowserAsync from "@/utils/openWebBrowserAsync";
import { StyleSheet, View } from "react-native";

import { theme } from "@/theme";

export function LiveStreamInfo() {
  const handlePress = () => {
    openWebBrowserAsync("https://conf.react.dev/#newsletter");
  };

  const borderColor = useThemeColor(theme.color.textSecondary);
  return (
    <ThemedView style={styles.container} color={theme.color.backgroundElement}>
      <View style={[styles.liveStreamContainer, { borderColor }]}>
        <ThemedView
          style={styles.liveStreamDot}
          color={theme.color.textSecondary}
        />
        <ThemedText
          fontWeight="semiBold"
          fontSize={14}
          color={theme.color.textSecondary}
        >
          Live Stream
        </ThemedText>
      </View>
      <ThemedText
        style={{ marginBottom: theme.space24 }}
        color={theme.color.textSecondary}
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
    marginHorizontal: theme.space24,
    marginBottom: theme.space16,
    borderRadius: theme.borderRadius12,
    padding: theme.space24,
    alignItems: "center",
  },
  liveStreamContainer: {
    borderWidth: 2,
    paddingHorizontal: theme.space8,
    paddingVertical: theme.space4,
    borderRadius: theme.borderRadius6,
    marginBottom: theme.space16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.space8,
  },
  liveStreamDot: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius4,
  },
});
