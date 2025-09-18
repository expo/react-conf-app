import { Platform, Pressable, StyleSheet, View } from "react-native";
import { getAppIcon, setAppIcon } from "expo-dynamic-app-icon";

import { ThemedText, ThemedView, useThemeColor } from "@/components/Themed";
import { theme } from "../theme";
import { Image } from "expo-image";
import { useState } from "react";
import * as Haptics from "expo-haptics";

const defaultIcon = {
  id: "default",
  name: "Default",
  icon: require("@/assets/app-icons/icon-default.png"),
  iconAndroid: require("@/assets/app-icons/icon-default-android.png"),
};

const icons = [
  {
    id: "light",
    name: "Light",
    icon: require("@/assets/app-icons/icon-light.png"),
    iconAndroid: require("@/assets/app-icons/icon-light-android.png"),
  },
  {
    id: "gradient",
    name: "Gradient",
    icon: require("@/assets/app-icons/icon-gradient.png"),
    iconAndroid: require("@/assets/app-icons/icon-gradient-android.png"),
  },
  {
    id: "fancy",
    name: "Vegas",
    icon: require("@/assets/app-icons/icon-fancy.png"),
    iconAndroid: require("@/assets/app-icons/icon-fancy-android.png"),
  },
];

export default function AppIconModal() {
  const [currentIcon, setCurrentIcon] = useState(getAppIcon());
  const borderColor = useThemeColor(theme.color.border);

  const handleSetAppIcon = (id: string) => {
    if (currentIcon !== id) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
      setAppIcon(id);
      setCurrentIcon(id);
    }
  };

  return (
    <ThemedView style={styles.container} color={theme.color.background}>
      <Pressable
        style={styles.defaultIconContainer}
        onPress={() => handleSetAppIcon(defaultIcon.id)}
      >
        <Image
          source={defaultIcon.icon}
          style={[styles.icon, { borderColor }]}
        />
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <ThemedText fontWeight="semiBold" fontSize={theme.fontSize18}>
            {defaultIcon.name}{" "}
          </ThemedText>
          <ThemedText fontWeight="medium" fontSize={theme.fontSize14}>
            {currentIcon === defaultIcon.id && "(current)"}
          </ThemedText>
        </View>
      </Pressable>
      <View style={styles.customIconsContainer}>
        {icons.map((icon) => (
          <Pressable
            key={icon.name}
            style={styles.customIconContainer}
            onPress={() => handleSetAppIcon(icon.id)}
          >
            <Image source={icon.icon} style={[styles.icon, { borderColor }]} />
            <ThemedText fontSize={theme.fontSize18}>{icon.name}</ThemedText>
            {currentIcon === icon.id && (
              <ThemedText fontSize={theme.fontSize14}>{"(current)"}</ThemedText>
            )}
          </Pressable>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: theme.space32,
    paddingVertical: theme.space24,
  },
  customIconContainer: {
    alignItems: "center",
    gap: theme.space8,
    justifyContent: "center",
  },
  customIconsContainer: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  defaultIconContainer: {
    alignItems: "center",
    gap: theme.space8,
    justifyContent: "center",
  },
  icon: {
    borderRadius: Platform.select({
      ios: 22,
      android: 50,
    }),
    borderWidth: 1,
    height: 100,
    width: 100,
  },
});
