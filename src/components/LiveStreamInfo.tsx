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
          fontSize={14}
          color={{
            light: theme.color.textSecondary.light,
            dark: theme.colorWhite,
          }}
        >
          Live Stream
        </ThemedText>
      </View>
      <ThemedText
        style={{
          marginBottom: theme.space24,
          textAlign: "center",
          color: borderColor,
        }}
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
    borderRadius: theme.borderRadius32,
    padding: theme.space24,
    alignItems: "center",
  },
  liveStreamContainer: {
    borderWidth: 2,
    paddingHorizontal: theme.space8,
    paddingVertical: theme.space4,
    borderRadius: theme.borderRadius32,
    marginBottom: theme.space16,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: theme.space8,
  },
  liveStreamDot: {
    width: 8,
    height: 8,
    borderRadius: theme.borderRadius32,
  },
});
