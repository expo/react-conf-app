import * as Application from "expo-application";
import { View, StyleSheet } from "react-native";

import { ThemedText } from "./Themed";

import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { formatFullDate } from "@/utils/formatDate";
import { useUpdates } from "expo-updates";

export function BuildDetails() {
  const lastRefreshed = useReactConfStore((state) => state.lastRefreshed);
  const updates = useUpdates();

  const currentUpdateId = updates?.currentlyRunning?.updateId;

  return (
    <View style={styles.container}>
      <ThemedText fontSize={12}>
        v{Application.nativeApplicationVersion} (
        {Application.nativeBuildVersion})
      </ThemedText>
      <ThemedText fontSize={12}>
        Schedule last refreshed:{" "}
        {lastRefreshed ? formatFullDate(lastRefreshed) : "Never"}
      </ThemedText>
      {currentUpdateId ? (
        <ThemedText fontSize={12} style={{ color: theme.colorGrey }}>
          {currentUpdateId}
        </ThemedText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingTop: theme.space12,
    paddingBottom: theme.space8,
  },
});
