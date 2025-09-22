import {
  ThemedPressable,
  ThemedText,
  ThemedView,
  useThemeColor,
} from "./Themed";
import { theme } from "@/theme";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ConferenceDay } from "@/consts";
import { Host, Picker } from "@expo/ui/swift-ui";

interface DayPickerProps {
  selectedDay: ConferenceDay;
  onSelectDay: (day: ConferenceDay) => void;
}

export function DayPicker({ selectedDay, onSelectDay }: DayPickerProps) {
  const backgroundColor = useThemeColor(theme.color.background);
  const transparentColor = useThemeColor(theme.color.transparent);

  return (
    <View style={{ paddingBottom: theme.space24 }}>
      <Host matchContents style={styles.dayPicker}>
        <Picker
          options={["Day 1", "Day 2"]}
          selectedIndex={selectedDay === ConferenceDay.One ? 0 : 1}
          onOptionSelected={({ nativeEvent: { index } }) => {
            onSelectDay(index === 0 ? ConferenceDay.One : ConferenceDay.Two);
          }}
          variant="segmented"
        />
      </Host>
      <LinearGradient
        colors={[backgroundColor, transparentColor]}
        style={styles.fadeGradient}
        pointerEvents="none"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  dayPicker: {
    marginTop: theme.space16,
    marginHorizontal: theme.space24,
    height: 31, // fixed height to prevent jumping
  },

  fadeGradient: {
    height: theme.space24,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
