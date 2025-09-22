import { StyleSheet } from "react-native";

import { ThemedPressable, ThemedText } from "./Themed";

import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { getCurrentTimezone } from "@/utils/formatDate";
import * as Haptics from "expo-haptics";

export function TimeZoneSwitch() {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);
  const toggleLocalTz = useReactConfStore((state) => state.toggleLocalTz);

  const handleToggleLocalTz = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    toggleLocalTz();
  };

  return (
    <ThemedPressable
      style={styles.container}
      onPress={handleToggleLocalTz}
      backgroundColor={theme.color.backgroundElement}
    >
      <ThemedText fontSize={12} fontWeight="semiBold">
        {shouldUseLocalTz ? getCurrentTimezone() : "PDT"}
      </ThemedText>
    </ThemedPressable>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignSelf: "flex-end",
    height: 32,
    borderRadius: theme.borderRadius40,
    paddingHorizontal: theme.space16,
  },
});
