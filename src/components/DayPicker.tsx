import { useThemeColor } from "./Themed";
import { theme } from "@/theme";
import { useWindowDimensions, View, StyleSheet, Platform } from "react-native";
import { ConferenceDay } from "@/consts";
import { Picker } from "@expo/ui/jetpack-compose";

interface DayPickerProps {
  selectedDay: ConferenceDay;
  onSelectDay: (day: ConferenceDay) => void;
}

export function DayPicker({ selectedDay, onSelectDay }: DayPickerProps) {
  const backgroundColor = useThemeColor(theme.color.background);
  const width = useWindowDimensions().width;
  const tintColor = useThemeColor(theme.color.reactBlue);
  const colorText = useThemeColor({
    light: Platform.select({
      ios: theme.color.text.light,
      android: theme.color.text.dark,
    }),
    dark: Platform.select({
      ios: theme.color.text.dark,
      android: theme.color.text.light,
    }),
  });
  const inactiveColorText = useThemeColor(theme.color.textSecondary);
  const backgroundSecondary = useThemeColor(theme.color.backgroundSecondary);

  return (
    <View
      style={{
        paddingVertical: theme.space4,
        backgroundColor: backgroundColor,
      }}
    >
      <Picker
        options={["Day 1", "Day 2"]}
        selectedIndex={selectedDay === ConferenceDay.One ? 0 : 1}
        onOptionSelected={({ nativeEvent: { index } }) => {
          onSelectDay(index === 0 ? ConferenceDay.One : ConferenceDay.Two);
        }}
        color={backgroundColor}
        elementColors={{
          activeContainerColor: tintColor,
          activeContentColor: colorText,
          activeBorderColor: "transparent",
          inactiveContainerColor: backgroundSecondary,
          inactiveContentColor: inactiveColorText,
          inactiveBorderColor: "transparent",
        }}
        variant="segmented"
        style={{
          ...styles.picker,
          width: width - theme.space24 * 2,
        }}
      />

      {/* Used to prevent onPress events from being triggered in components behind the picker */}
      <View style={styles.overlay} pointerEvents="none" />
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    height: 50,
    position: "absolute",
    width: "100%",
  },
  picker: {
    alignSelf: "center",
    height: 40,
    paddingVertical: theme.space24,
  },
});
