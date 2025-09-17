import { StyleSheet, Switch } from "react-native";
import { ThemedText, ThemedView } from "./Themed";
import { useState } from "react";
import { theme } from "@/theme";

export function ReactCompilerDemo() {
  const [value, setValue] = useState(false);

  return (
    <>
      <ThemedText
        style={styles.centered}
        marginBottom={theme.space12}
        fontWeight="bold"
        fontSize={24}
      >
        React Compiler Demo
      </ThemedText>
      <ThemedView
        darkColor="rgba(255,255,255,0.15)"
        lightColor={theme.lightActiveContent}
        style={styles.section}
      >
        <ThemedText style={{ marginBottom: theme.space8 }}>
          <ThemedText fontWeight="bold">Without React Compiler:</ThemedText> the
          value in RenderCounter increments with each toggle
        </ThemedText>
        <ThemedText style={{ marginBottom: theme.space24 }}>
          <ThemedText fontWeight="bold">With React Compiler:</ThemedText> the
          value in RenderCounter does not increment
        </ThemedText>
        <ThemedView
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Switch
            value={value}
            onValueChange={(value) => setValue(value)}
            trackColor={{ true: theme.colorReactLightBlue }}
          />
          <RenderCounter />
        </ThemedView>
      </ThemedView>
    </>
  );
}

let numberOfRenders = 0;

function RenderCounter() {
  numberOfRenders++;
  return (
    <ThemedView style={{ flex: 1, marginLeft: theme.space24 }}>
      <ThemedText>Number of renders: {numberOfRenders}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  centered: {
    textAlign: "center",
  },
  section: {
    padding: theme.space24,
    marginBottom: 200,
  },
});
