import { View, StyleSheet } from "react-native";

import { ThemedText, ThemedView } from "./Themed";
import { theme } from "../theme";

export function Tags({ tags }: { tags: string[] }) {
  if (!tags.length) {
    return null;
  }

  return (
    <View style={styles.container}>
      {tags.map((tag) => (
        <ThemedView
          key={tag}
          style={styles.tag}
          darkColor={theme.colorDarkGreen}
          lightColor={theme.colorLightGreen}
        >
          <ThemedText fontSize={14}>{tag}</ThemedText>
        </ThemedView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.space16,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  tag: {
    borderRadius: theme.borderRadius20,
    paddingVertical: theme.space4,
    paddingHorizontal: theme.space8,
    marginRight: theme.space8,
    marginBottom: theme.space8,
  },
});
