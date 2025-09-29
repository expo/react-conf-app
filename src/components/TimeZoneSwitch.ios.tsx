import { useReactConfStore } from "@/store/reactConfStore";
import { getCurrentTimezone } from "@/utils/formatDate";

import {
  Button,
  ContextMenu,
  Host,
  HStack,
  Image,
  Picker,
  Text,
} from "@expo/ui/swift-ui";
import * as Haptics from "expo-haptics";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { frame } from "@expo/ui/swift-ui/modifiers";
import { theme } from "@/theme";
import { StyleSheet } from "react-native";

const options = ["PDT (Venue)", `${getCurrentTimezone()} (Local)`];

export function TimeZoneSwitch() {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);
  const toggleLocalTz = useReactConfStore((state) => state.toggleLocalTz);

  const selectedIndex = shouldUseLocalTz ? 1 : 0;

  const handleToggleLocalTz = (newIndex: number) => {
    if (selectedIndex !== newIndex) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      toggleLocalTz();
    }
  };

  return (
    <Host style={styles.container}>
      <ContextMenu>
        <ContextMenu.Items>
          <Picker
            selectedIndex={selectedIndex}
            options={options}
            onOptionSelected={({ nativeEvent: { index } }) =>
              handleToggleLocalTz(index)
            }
          />
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Button
            variant={isLiquidGlassAvailable() ? "glass" : "bordered"}
            color={isLiquidGlassAvailable() ? "primary" : "gray"}
          >
            <HStack modifiers={[frame({ width: 70 })]} spacing={theme.space8}>
              <Text weight="semibold" size={theme.fontSize14}>
                {shouldUseLocalTz ? getCurrentTimezone().slice(0, 3) : "PDT"}
              </Text>
              <Image systemName="chevron.down" size={theme.fontSize18} />
            </HStack>
          </Button>
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 94,
    height: 34,
  },
});
