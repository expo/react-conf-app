import { View } from "react-native";
import { ThemedText } from "../Themed";
import { HeaderButtonProps } from "./HeaderButton.ios";

export function HeaderButton({ imageProps, buttonProps }: HeaderButtonProps) {
  return (
    <View>
      <ThemedText>Fallback</ThemedText>
    </View>
  );
}
