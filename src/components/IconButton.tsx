import { StyleSheet } from "react-native";

import { ThemedView, useThemeColor } from "./Themed";
import { Pressable } from "react-native-gesture-handler";

import { theme } from "@/theme";

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

  return (
    <Pressable onPress={onPress}>
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
    padding: theme.space12,
    borderRadius: theme.borderRadius6,
    marginHorizontal: theme.space8,
  },
});
