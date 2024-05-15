import { Button } from "./Button";
import { InfoSection } from "./InfoSection";
import { ThemedText } from "./Themed";
import * as Linking from "expo-linking";

import { theme } from "@/theme";

export function DiscordInfo() {
  const handlePress = () => {
    Linking.openURL("https://discord.gg/reactconf");
  };

  return (
    <InfoSection title="Discord Server">
      <ThemedText style={{ marginBottom: theme.space24 }}>
        Chat with other folks at the conference on the React Conf 2024 Discord
        server. Coordinate around ridesharing and external activities.
      </ThemedText>
      <Button onPress={handlePress} title="Join us on Discord" />
    </InfoSection>
  );
}
