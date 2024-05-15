import { View, StyleSheet } from "react-native";

import { ThemedText } from "./Themed";
import { theme } from "@/theme";
import { openBrowserAsync } from "expo-web-browser";
import { TouchableOpacity } from "react-native-gesture-handler";

export function PoweredByExpo() {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        hitSlop={{ top: 30, left: 30, right: 30, bottom: 30 }}
        onPress={() => openBrowserAsync("https://expo.dev")}
      >
        <ThemedText fontSize={13}>Powered by Expo</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: theme.space12 * 2,
  },
});
