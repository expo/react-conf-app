import { useReactConfStore } from "@/store/reactConfStore";
import { getCurrentTimezone } from "@/utils/formatDate";

import { Button, ContextMenu, Host, Picker } from "@expo/ui/swift-ui";
import * as Haptics from "expo-haptics";

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
          <Button variant="glass" systemImage="globe" />
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
