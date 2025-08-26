import Entypo from "@expo/vector-icons/build/Entypo";
import { useRouter } from "expo-router";
import { StyleSheet } from "react-native";
import { Pressable } from "react-native-gesture-handler";

import { useThemeColor } from "./Themed";

import { theme } from "@/theme";

export function BackButton() {
  const router = useRouter();
  const color = useThemeColor({
    light: theme.colorBlack,
    dark: theme.colorWhite,
  });
  return (
    <Pressable onPress={router.back} hitSlop={40} style={styles.button}>
      <Entypo name="chevron-left" size={24} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginLeft: -10,
  },
});
