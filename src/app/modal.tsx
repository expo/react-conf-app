import { StyleSheet } from "react-native";
import { ThemedText, ThemedView } from "@/components/Themed";
import { theme } from "@/theme";

export default function Modal() {
  return (
    <ThemedView style={styles.container} color={theme.color.background}>
      <ThemedText fontSize={24} fontWeight="bold">
        Hi! 👋
      </ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
