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
  button: {
    alignItems: "center",
    borderRadius: theme.borderRadius34,
    justifyContent: "center",
    minHeight: 40,
    minWidth: 150,
    paddingHorizontal: theme.space24,
    paddingVertical: theme.space8,
    width: "100%",
  },
  text: {
    color: theme.colorWhite,
  },
});
