import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { getCurrentTimezone } from "@/utils/formatDate";

import { Button, ContextMenu, Host, Picker } from "@expo/ui/swift-ui";
import * as Haptics from "expo-haptics";
import { useThemeColor } from "./Themed";
import { isLiquidGlassAvailable } from "expo-glass-effect";
import { frame } from "@expo/ui/swift-ui/modifiers";

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
  const color = useThemeColor(theme.color.reactBlue);

  return (
    <Host style={{ width: 33, height: 44 }}>
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
            systemImage="clock"
            modifiers={[frame({ width: 108 })]}
            color={!isLiquidGlassAvailable() ? color : "primary"}
          />
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
