import { theme } from "@/theme";
import { StyleSheet } from "react-native";
import { ConferenceDay } from "@/consts";
import { Host, Picker } from "@expo/ui/swift-ui";
import { ThemedView } from "./Themed";

interface DayPickerProps {
  selectedDay: ConferenceDay;
  onSelectDay: (day: ConferenceDay) => void;
}

export function DayPicker({ selectedDay, onSelectDay }: DayPickerProps) {
  return (
    <ThemedView style={{ paddingBottom: theme.space24 }}>
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
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  dayPicker: {
    marginTop: theme.space16,
    marginHorizontal: theme.space24,
    height: 31, // fixed height to prevent jumping
  },
});
