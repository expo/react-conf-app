import { theme } from "@/theme";
import { StyleSheet, View } from "react-native";
import { ConferenceDay } from "@/consts";
import { Host, Picker } from "@expo/ui/swift-ui";
import { GlassView } from "expo-glass-effect";

interface DayPickerProps {
  selectedDay: ConferenceDay;
  onSelectDay: (day: ConferenceDay) => void;
}

export function DayPicker({ selectedDay, onSelectDay }: DayPickerProps) {
  return (
    <View style={{ paddingBottom: theme.space24 }}>
      <GlassView style={styles.glassView}>
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
      </GlassView>
    </View>
  );
}

const styles = StyleSheet.create({
  dayPicker: {
    height: 31, // fixed height to prevent jumping
  },
  glassView: {
    borderRadius: theme.borderRadius80,
    height: 32,
    marginHorizontal: theme.space16,
    marginTop: theme.space16,
    width: "auto",
  },
});
