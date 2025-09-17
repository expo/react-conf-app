import { Image } from "expo-image";
import { View, StyleSheet, Platform } from "react-native";
import AppIcon from "react-native-dynamic-app-icon";
import { Pressable } from "react-native-gesture-handler";

import { ThemedText, ThemedView } from "@/components/Themed";
import { theme } from "../theme";

const defaultIcon = require("@/assets/icon.png");
const desertIcon = require("@/assets/icons/icon-desert.png");

export default function ChangeAppIcon() {
  if (Platform.OS === "android") {
    return null;
  }
  return (
    <ThemedView
      darkColor={theme.darkActiveContent}
      lightColor={theme.lightActiveContent}
      style={styles.section}
    >
      <ThemedText
        style={styles.centered}
        marginBottom={theme.space12}
        fontWeight="medium"
        fontSize={18}
      >
        Choose a custom app icon
      </ThemedText>
      <View style={styles.icons}>
        {[defaultIcon, desertIcon].map((icon, index) => (
          <Pressable
            key={index}
            onPress={() => {
              AppIcon.setAppIcon(String(index));
            }}
          >
            <Image source={icon} style={styles.icon} />
          </Pressable>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 80,
    height: 80,
    borderRadius: 10,
    margin: 4,
  },
  icons: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  heading: {
    textAlign: "center",
  },
  centered: {
    textAlign: "center",
  },
  section: {
    padding: theme.space24,
    marginBottom: theme.space24,
  },
});
