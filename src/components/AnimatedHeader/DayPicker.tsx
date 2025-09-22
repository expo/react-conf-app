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
import {
  useAnimatedStyle,
  interpolate,
  Extrapolation,
  SharedValue,
} from "react-native-reanimated";

const backgroundHighlight = { dark: "#1A1A1A", light: "#E6E6E6" };

interface DayPickerProps {
  isDayOne: boolean;
  onSelectDay: (day: ConferenceDay) => void;
  scrollOffset: SharedValue<number>;
}

export function DayPicker({
  isDayOne,
  onSelectDay,
  scrollOffset,
}: DayPickerProps) {
  const backgroundColor = useThemeColor(theme.color.background);
  const transparentColor = useThemeColor(theme.color.transparent);

  const animatedDayPickerStyle = useAnimatedStyle(() => {
    const padding = interpolate(
      scrollOffset.value,
      [580, 600],
      [8, 4],
      Extrapolation.CLAMP,
    );

    const borderRadius = interpolate(
      scrollOffset.value,
      [580, 600],
      [24, 80],
      Extrapolation.CLAMP,
    );

    return {
      padding,
      borderRadius,
    };
  });

  const animatedDayPickerItemStyle = useAnimatedStyle(() => {
    const height = interpolate(
      scrollOffset.value,
      [580, 600],
      [48, 40],
      Extrapolation.CLAMP,
    );

    const borderRadius = interpolate(
      scrollOffset.value,
      [580, 600],
      [16, 45],
      Extrapolation.CLAMP,
    );

    return {
      height,
      borderRadius,
    };
  });

  return (
    <>
      <ThemedView color={theme.color.background}>
        <ThemedView
          style={[styles.dayPicker, animatedDayPickerStyle]}
          color={backgroundHighlight}
          animated
        >
          <ThemedPressable
            onPress={() => onSelectDay(ConferenceDay.One)}
            backgroundColor={(!isDayOne && backgroundHighlight) || undefined}
            style={[styles.dayPickerItem, animatedDayPickerItemStyle]}
            animated
          >
            <ThemedText fontWeight="semiBold" fontSize={theme.fontSize16}>
              Day 1
            </ThemedText>
          </ThemedPressable>

          <ThemedPressable
            onPress={() => onSelectDay(ConferenceDay.Two)}
            backgroundColor={(isDayOne && backgroundHighlight) || undefined}
            style={[styles.dayPickerItem, animatedDayPickerItemStyle]}
            animated
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dayPickerItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  fadeGradient: {
    height: 40,
  },
});
