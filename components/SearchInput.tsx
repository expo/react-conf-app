import Entypo from "@expo/vector-icons/build/Entypo";
import Feather from "@expo/vector-icons/build/Feather";
import { TextInput, StyleSheet, View } from "react-native";

import { useThemeColor } from "./Themed";

import { theme } from "@/theme";
import { PressableArea } from "./PressableArea";

export function SearchInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const iconColor = useThemeColor({
    light: theme.colorGrey,
    dark: theme.colorWhite,
  });
  const textColor = useThemeColor({
    light: theme.colorBlack,
    dark: theme.colorWhite,
  });
  const searchInputColor = useThemeColor({
    light: theme.colorWhite,
    dark: "rgba(255,255,255,0.15)",
  });

  const placeholderTextColor = useThemeColor({
    light: theme.colorGrey,
    dark: "rgba(255,255,255,0.5)",
  });

  const shadow = useThemeColor({ light: theme.dropShadow, dark: undefined });

  return (
    <View>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholderTextColor={placeholderTextColor}
        style={[
          styles.input,
          shadow,
          { backgroundColor: searchInputColor, color: textColor },
        ]}
        placeholder="Search by name..."
        autoCorrect={false}
        returnKeyType="done"
      />
      <Feather
        name="search"
        size={24}
        color={iconColor}
        style={styles.searchIcon}
      />
      {value ? (
        <PressableArea
          onPress={() => onChange("")}
          style={styles.clearIcon}
          hitSlop={30}
        >
          <Entypo name="circle-with-cross" size={24} color={iconColor} />
        </PressableArea>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderRadius: theme.borderRadius6,
    marginHorizontal: theme.space16,
    marginTop: theme.space16,
    marginBottom: theme.space12,
    padding: theme.space8,
    paddingLeft: 42,
    fontFamily: theme.fontFamily,
    fontSize: theme.fontSize18,
  },
  searchIcon: {
    position: "absolute",
    top: theme.space24,
    left: theme.space24,
  },
  clearIcon: {
    position: "absolute",
    top: theme.space24,
    right: theme.space24,
  },
});
