import { StyleSheet } from "react-native";
import Entypo from "@expo/vector-icons/Entypo";

import { ThemedText, useThemeColor } from "./Themed";

import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { getCurrentTimezone } from "@/utils/formatDate";
import { useActionSheet } from "@expo/react-native-action-sheet";
import { PressableArea } from "./PressableArea";

export function TimeZoneSwitch() {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);
  const toggleLocalTz = useReactConfStore((state) => state.toggleLocalTz);

  const iconColor = useThemeColor({
    light: theme.colorBlack,
    dark: theme.colorWhite,
  });

  const { showActionSheetWithOptions } = useActionSheet();

  const onPress = () => {
    const options = [
      shouldUseLocalTz
        ? "Use venue time (PDT)"
        : `Use local time (${getCurrentTimezone()})`,
      "Cancel",
    ];
    const cancelButtonIndex = 1;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (selectedIndex) => {
        if (selectedIndex === 0) {
          toggleLocalTz();
        }
      },
    );
  };

  return (
    <PressableArea style={styles.container} onPress={onPress}>
      <ThemedText fontSize={14} fontWeight="medium">
        {shouldUseLocalTz ? "Local Time " : "Venue Time Zone "}
        <ThemedText fontSize={12} fontWeight="light">
          ({shouldUseLocalTz ? getCurrentTimezone() : "PDT"})
        </ThemedText>
      </ThemedText>
      <Entypo name="chevron-down" size={24} color={iconColor} />
    </PressableArea>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.space16,
    flexDirection: "row",
    alignItems: "center",
    height: 55,
    justifyContent: "flex-end",
    flex: 1,
  },
  switch: {
    marginHorizontal: theme.space8,
  },
});
