import { StyleSheet } from "react-native";

import { ThemedView, useThemeColor } from "./Themed";
import { TouchableOpacity } from "react-native-gesture-handler";

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
  const backgroundColorActive = useThemeColor({
    light: theme.colorReactLightBlue,
    dark: theme.colorReactLightBlue,
  });
  const shadow = useThemeColor({ light: theme.dropShadow, dark: undefined });

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
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
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: theme.space12,
    borderRadius: theme.borderRadius6,
    marginHorizontal: theme.space8,
  },
});
