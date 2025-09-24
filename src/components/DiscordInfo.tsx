import { Button } from "./Button";
import { ThemedText, ThemedView, useThemeColor } from "./Themed";
import * as Linking from "expo-linking";
import { StyleSheet } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";

import { theme } from "@/theme";

export function DiscordInfo() {
  const handlePress = () => {
    Linking.openURL("https://discord.gg/reactconf");
  };

  const iconColor = useThemeColor({
    light: theme.color.textSecondary.light,
    dark: theme.colorWhite,
  });

  return (
    <ThemedView style={styles.container} color={theme.color.backgroundElement}>
      <MaterialIcons name="discord" size={42} color={iconColor} />
      <ThemedText style={styles.text} color={theme.color.textSecondary}>
        Chat with other folks at the conference via the dedicated Discord
        server. Fun activities? Ridesharing?
      </ThemedText>
      <Button onPress={handlePress} title="Join us on Discord" />
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
    gap: theme.space16,
  },
  text: {
    textAlign: "center",
    marginBottom: theme.space8,
  },
});
