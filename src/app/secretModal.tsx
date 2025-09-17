import LottieView from "lottie-react-native";
import { Platform, StyleSheet, useWindowDimensions } from "react-native";

import { ThemedText, ThemedView } from "@/components/Themed";
import { theme } from "../theme";
import { ExpoImageDemo } from "@/components/ExpoImageDemo";
import ChangeAppIcon from "@/components/ChangeAppIcon";
import { ScrollView } from "react-native-gesture-handler";
import { ReactCompilerDemo } from "@/components/ReactCompilerDemo";

export default function SecretModal() {
  const { width } = useWindowDimensions();

  return (
    <ScrollView>
      <ThemedView style={styles.container} color={theme.color.background}>
        {Platform.OS === "ios" ? (
          <LottieView
            autoPlay
            loop={false}
            style={[styles.animation, { width }]}
            source={require("@/assets/lottie/tada.json")}
          />
        ) : null}
        <ThemedText
          style={styles.heading}
          fontWeight="bold"
          fontSize={24}
          marginBottom={theme.space24}
        >
          You found the secret modal!
        </ThemedText>
        <ChangeAppIcon />
        <ThemedText
          marginBottom={theme.space12}
          fontWeight="medium"
          fontSize={18}
          style={styles.description}
        >
          We&apos;ll use this place for more demos in the future. For now,
          here&apos;s a little example of native image transitions.
        </ThemedText>
        <ExpoImageDemo />
        <ReactCompilerDemo />
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: theme.space24,
  },
  content: {
    paddingHorizontal: theme.space24,
  },
  heading: {
    paddingHorizontal: theme.space24,
    textAlign: "center",
  },
  animation: {
    height: 200,
    position: "absolute",
  },
  description: {
    paddingHorizontal: theme.space24,
    marginBottom: theme.fontSize24,
  },
});
