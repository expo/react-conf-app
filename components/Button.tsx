import { StyleSheet, ActivityIndicator } from "react-native";
import { Pressable } from "react-native-gesture-handler";

import { ThemedText, useThemeColor } from "./Themed";

import { theme } from "@/theme";

export function Button({
  title,
  onPress,
  isLoading,
}: {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
}) {
  const backgroundColor = useThemeColor({
    light: theme.colorBlack,
    dark: theme.colorWhite,
  });
  const textColor = useThemeColor({
    light: theme.colorWhite,
    dark: theme.colorBlack,
  });

  return (
    <Pressable onPress={onPress} style={[styles.button, { backgroundColor }]}>
      {isLoading ? (
        <ActivityIndicator color={theme.colorWhite} />
      ) : (
        <ThemedText
          fontSize={16}
          fontWeight="semiBold"
          style={[styles.text, { color: textColor }]}
        >
          {title}
        </ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  text: {
    color: theme.colorWhite,
  },
  button: {
    width: "100%",
    paddingVertical: theme.space8,
    paddingHorizontal: theme.space24,
    borderRadius: theme.borderRadius34,
    minWidth: 150,
    minHeight: 40,
    alignItems: "center",
    justifyContent: "center",
  },
});
