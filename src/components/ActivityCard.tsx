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
    <View style={styles.container}>
      <ThemedText
        fontSize={14}
        fontWeight="medium"
        color={theme.color.textSecondary}
        style={{ marginLeft: theme.space24 }}
      >
        {formatSessionTime(session, shouldUseLocalTz)}
      </ThemedText>
      <ThemedView style={styles.content} color={theme.color.backgroundTertiary}>
        <View style={styles.row}>
          <ThemedText fontSize={18} fontWeight="semiBold">
            {session.title}
          </ThemedText>
          <ThemedText fontSize={14} fontWeight="light">
            {session.room}
          </ThemedText>
        </View>
      </ThemedView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: theme.space24,
    marginBottom: theme.space16,
    borderRadius: theme.borderRadius10,
    gap: theme.space8,
  },
  content: {
    padding: theme.space24,
    justifyContent: "center",
    borderRadius: theme.borderRadius12,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
