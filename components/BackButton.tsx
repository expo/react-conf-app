import AntDesign from "@expo/vector-icons/build/AntDesign";
import Entypo from "@expo/vector-icons/build/Entypo";
import { useRouter } from "expo-router";
import { Platform, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

import { useThemeColor } from "./Themed";

import { theme } from "@/theme";

export function BackButton() {
  const router = useRouter();
  const color = useThemeColor({
    light: theme.colorBlack,
    dark: theme.colorWhite,
  });
  return (
    <TouchableOpacity onPress={router.back} hitSlop={40} style={styles.button}>
      {Platform.OS === "ios" ? (
        <AntDesign name="closecircle" size={24} color={color} />
      ) : (
        <Entypo name="chevron-left" size={24} color={color} />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 10,
    marginLeft: -10,
  },
});
