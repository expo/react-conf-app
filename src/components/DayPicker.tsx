import { useThemeColor } from "./Themed";
import { theme } from "@/theme";
import { useWindowDimensions, View } from "react-native";
import { ConferenceDay } from "@/consts";
import { Picker } from "@expo/ui/jetpack-compose";

interface DayPickerProps {
  selectedDay: ConferenceDay;
  onSelectDay: (day: ConferenceDay) => void;
}

export function DayPicker({ selectedDay, onSelectDay }: DayPickerProps) {
  const backgroundColor = useThemeColor(theme.color.background);
  const width = useWindowDimensions().width;
  const tintColor = useThemeColor({
    light: theme.colorReactLightBlue,
    dark: theme.colorReactDarkBlue,
  });
  const colorBorder = useThemeColor({
    light: theme.color.border.light,
    dark: theme.color.border.dark,
  });
  const colorText = useThemeColor({
    light: theme.color.text.light,
    dark: theme.color.text.dark,
  });

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
          activeBorderColor: tintColor,
          inactiveContainerColor: backgroundColor,
          inactiveContentColor: colorText,
          inactiveBorderColor: colorBorder,
        }}
        variant="segmented"
        style={{
          height: 40,
          width: width - theme.space24 * 2,
          alignSelf: "center",
          paddingVertical: theme.space24,
        }}
      />

      {/* Used to prevent onPress events from being triggered in components behind the picker */}
      <View
        style={{
          height: 50,
          width: "100%",
          position: "absolute",
        }}
        pointerEvents="none"
      />
    </View>
  );
}
