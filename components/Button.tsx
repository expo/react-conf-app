import { StyleSheet, ActivityIndicator } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { ThemedText, useThemeColor } from "./Themed";

import { theme } from "@/theme";

const buttonTextSize = 22;

export function Button({
  title,
  onPress,
  isLoading,
}: {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
}) {
  const shadow = useThemeColor({ light: theme.dropShadow, dark: undefined });

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, shadow]}
      activeOpacity={0.8}
    >
      {isLoading ? (
        <ActivityIndicator color={theme.colorWhite} />
      ) : (
        <ThemedText
          fontSize={buttonTextSize}
          fontWeight="medium"
          style={styles.text}
        >
          {title}
        </ThemedText>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  text: {
    color: theme.colorWhite,
    lineHeight: buttonTextSize,
  },
  button: {
    paddingVertical: theme.space8,
    paddingHorizontal: theme.space24,
    borderRadius: theme.borderRadius6,
    backgroundColor: theme.colorReactDarkBlue,
    minWidth: 150,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
