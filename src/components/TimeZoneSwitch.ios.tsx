import { useReactConfStore } from "@/store/reactConfStore";

import { Button, ContextMenu, Host, Picker } from "@expo/ui/swift-ui";

export function TimeZoneSwitch() {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);
  const toggleLocalTz = useReactConfStore((state) => state.toggleLocalTz);

  return (
    <Host style={{ width: 33, height: 44 }}>
      <ContextMenu>
        <ContextMenu.Items>
          <Picker
            options={["PDT", "PST"]}
            selectedIndex={shouldUseLocalTz ? 0 : 1}
            onOptionSelected={({ nativeEvent: { index } }) => toggleLocalTz()}
          />
        </ContextMenu.Items>
        <ContextMenu.Trigger>
          <Button variant="glass" systemImage="globe" />
        </ContextMenu.Trigger>
      </ContextMenu>
    </Host>
  );
}
