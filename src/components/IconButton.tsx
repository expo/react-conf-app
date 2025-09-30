import { StyleSheet } from "react-native";

import { ThemedView, useThemeColor } from "./Themed";
import { Pressable } from "react-native-gesture-handler";

import { theme } from "@/theme";
import * as Haptics from "expo-haptics";

export function IconButton({
  onPress,
  children,
  isActive,
}: {
  onPress: () => void;
  children: React.ReactElement;
  isActive?: boolean;
}) {
  const backgroundColor = useThemeColor({
    light: theme.colorWhite,
    dark: `rgba(255, 255, 255, 0.15)`,
  });
  const backgroundColorActive = useThemeColor(theme.color.reactBlue);
  const shadow = useThemeColor({ light: theme.dropShadow, dark: undefined });

  const handlePress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    onPress();
  };

  return (
    <Pressable onPress={handlePress}>
      <ThemedView
        style={[
          styles.button,
          shadow,
          {
            backgroundColor: isActive ? backgroundColorActive : backgroundColor,
          },
        ]}
      >
        {children}
      </ThemedView>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius6,
    marginHorizontal: theme.space8,
    padding: theme.space12,
  },
});
