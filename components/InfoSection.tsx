import { StyleSheet, View } from "react-native";

import { ThemedText, ThemedView } from "./Themed";

import { theme } from "@/theme";

export function InfoSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactElement | React.ReactElement[];
}) {
  return (
    <View style={styles.infoContainer}>
      <ThemedText fontSize={38} style={styles.heading}>
        {title}
      </ThemedText>
      <ThemedView
        style={styles.container}
        lightColor={theme.colorThemeGrey}
        darkColor="rgba(255, 255, 255, 0.15)"
      >
        {children}
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: theme.space24,
    paddingHorizontal: theme.space16,
  },
  heading: {
    marginBottom: theme.space12,
    marginLeft: theme.space16,
    marginTop: theme.space24,
  },
  infoContainer: {
    marginBottom: theme.space16,
  },
});
