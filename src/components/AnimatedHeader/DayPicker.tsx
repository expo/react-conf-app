import {
  ThemedPressable,
  ThemedText,
  ThemedView,
  useThemeColor,
} from "../Themed";
import { theme } from "@/theme";
import { StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ConferenceDay } from "@/consts";

const backgroundHighlight = { dark: "#1A1A1A", light: "#E6E6E6" };

interface DayPickerProps {
  isDayOne: boolean;
  onSelectDay: (day: ConferenceDay) => void;
}

export function DayPicker({ isDayOne, onSelectDay }: DayPickerProps) {
  const backgroundColor = useThemeColor(theme.color.background);
  const transparentColor = useThemeColor(theme.color.transparent);

  return (
    <>
      <ThemedView color={theme.color.background}>
        <ThemedView style={[styles.dayPicker]} color={backgroundHighlight}>
          <ThemedPressable
            onPress={() => onSelectDay(ConferenceDay.One)}
            backgroundColor={(!isDayOne && backgroundHighlight) || undefined}
            style={[styles.dayPickerItem]}
          >
            <ThemedText fontWeight="semiBold" fontSize={theme.fontSize16}>
              Day 1
            </ThemedText>
          </ThemedPressable>

          <ThemedPressable
            onPress={() => onSelectDay(ConferenceDay.Two)}
            backgroundColor={(isDayOne && backgroundHighlight) || undefined}
            style={[styles.dayPickerItem]}
          >
            <ThemedText fontWeight="semiBold" fontSize={theme.fontSize16}>
              Day 2
            </ThemedText>
          </ThemedPressable>
        </ThemedView>
      </ThemedView>
      <LinearGradient
        colors={[backgroundColor, transparentColor]}
        style={styles.fadeGradient}
        pointerEvents="none"
      />
    </>
  );
}

const styles = StyleSheet.create({
  dayPicker: {
    marginTop: theme.space24,
    marginHorizontal: theme.space24,
    borderRadius: theme.borderRadius24,
    padding: theme.space8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayPickerItem: {
    flex: 1,
    borderRadius: theme.borderRadius16,
    padding: theme.space12,
    justifyContent: "center",
    alignItems: "center",
    height: 48,
  },
  fadeGradient: {
    height: 40,
  },
});
