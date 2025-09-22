import { CollapsedHeader } from "./CollapsedHeader";
import { ExpandedHeader } from "./ExpandedHeader";
import { StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "../Themed";

export function AnimatedHeader() {
  const insets = useSafeAreaInsets();
  return (
    <ThemedView style={[styles.container, { paddingTop: insets.top }]}>
      <CollapsedHeader />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
  },
});
