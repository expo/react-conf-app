import { StyleSheet, View } from "react-native";

import { ThemedText, ThemedView } from "./Themed";

import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { Session } from "@/types";
import { formatSessionTime } from "@/utils/formatDate";

type Props = {
  session: Session;
};

export function ActivityCard({ session }: Props) {
  const shouldUseLocalTz = useReactConfStore((state) => state.shouldUseLocalTz);

  return (
    <ThemedView style={styles.container}>
      <ThemedText fontSize={16} fontWeight="medium">
        {formatSessionTime(session, shouldUseLocalTz)}
      </ThemedText>
      <View style={styles.row}>
        <ThemedText fontSize={20} fontWeight="bold">
          {session.title}
        </ThemedText>
        <ThemedText fontSize={14} fontWeight="light">
          {session.room}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.space16,
    marginBottom: theme.space16,
    paddingHorizontal: theme.space12,
    paddingVertical: theme.space8,
    borderRadius: theme.borderRadius10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
