import { Button } from "./Button";
import { InfoSection } from "./InfoSection";
import { ThemedText } from "./Themed";
import openWebBrowserAsync from "@/utils/openWebBrowserAsync";

import { theme } from "@/theme";

export function LiveStreamInfo() {
  const handlePress = () => {
    openWebBrowserAsync(
      "https://ti.to/reactconf/2024/with/free-livestream-access",
    );
  };
  return (
    <InfoSection title="Live Stream">
      <ThemedText
        fontWeight="bold"
        fontSize={24}
        style={{ marginBottom: theme.space12 }}
      >
        Free Livestream Access
      </ThemedText>
      <ThemedText style={{ marginBottom: theme.space24 }}>
        Join React Conf 2024 from anywhere with our Free Livestream Access!
        Watch all the talks remotely.
      </ThemedText>
      <Button onPress={handlePress} title="Sign up" />
    </InfoSection>
  );
}
