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

const backgroundHighlight = { dark: "#1A1A1A", light: "#E6E6E6" };

interface DayPickerProps {
  isDayOne: boolean;
  onSelectDay: (day: ConferenceDay) => void;
}

export function DayPicker({ isDayOne, onSelectDay }: DayPickerProps) {
  const backgroundColor = useThemeColor(theme.color.background);
  const transparentColor = useThemeColor(theme.color.transparent);

  return (
    <View style={{ paddingBottom: theme.space24 }}>
      <ThemedView color={theme.color.background} style={{ marginTop: 20 }}>
        <ThemedView style={styles.dayPicker} color={backgroundHighlight}>
          <ThemedPressable
            onPress={() => onSelectDay(ConferenceDay.One)}
            backgroundColor={(!isDayOne && backgroundHighlight) || undefined}
            style={styles.dayPickerItem}
          >
            <ThemedText fontWeight="semiBold" fontSize={theme.fontSize16}>
              Day 1
            </ThemedText>
          </ThemedPressable>

          <ThemedPressable
            onPress={() => onSelectDay(ConferenceDay.Two)}
            backgroundColor={(isDayOne && backgroundHighlight) || undefined}
            style={styles.dayPickerItem}
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
    </View>
  );
}

const styles = StyleSheet.create({
  dayPicker: {
    marginTop: theme.space32,
    marginHorizontal: theme.space24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: theme.borderRadius80,
    padding: theme.space4,
  },
  dayPickerItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 32,
    borderRadius: theme.borderRadius45,
  },
  fadeGradient: {
    height: theme.space24,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});
