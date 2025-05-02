import React from "react";
import { Keyboard, StyleSheet, View } from "react-native";

import { NotFound } from "@/components/NotFound";

import { SpeakerCard } from "@/components/SpeakerCard";
import { ThemedText, ThemedView } from "@/components/Themed";
import { useReactConfStore } from "@/store/reactConfStore";
import { theme } from "@/theme";
import { FlatList } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { useScrollToTop } from "@react-navigation/native";

export default function Speakers() {
  const ref = React.useRef(null);
  useScrollToTop(ref);
  const speakers = useReactConfStore((state) => state.allSessions.speakers);

  const params = useLocalSearchParams<{ q?: string }>();

  if (!speakers.length) {
    return <NotFound message="Speakers unavailable" />;
  }

  const searchText = params?.q?.toLowerCase() || "";

  const filteredSpeakers = speakers.filter((speaker) => {
    if (!searchText) {
      return true;
    }
    return speaker.fullName.toLowerCase().includes(searchText);
  });

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  return (
    <ThemedView
      style={styles.container}
      darkColor={theme.colorDarkBlue}
      lightColor={theme.colorWhite}
    >
      <FlatList
        scrollToOverflowEnabled
        contentInsetAdjustmentBehavior="automatic"
        onScrollBeginDrag={dismissKeyboard}
        keyboardShouldPersistTaps="handled"
        ref={ref}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        ItemSeparatorComponent={() => (
          <View style={{ height: theme.space16 }} />
        )}
        renderItem={({ item }) => <SpeakerCard speaker={item} key={item.id} />}
        data={filteredSpeakers}
        ListEmptyComponent={
          <ThemedView style={styles.noResultsContainer}>
            <ThemedText>
              No results found for{" "}
              <ThemedText fontWeight="bold">{searchText}</ThemedText>
            </ThemedText>
          </ThemedView>
        }
      />
    </ThemedView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingTop: theme.space16,
  },
  noResultsContainer: {
    paddingHorizontal: theme.space24,
  },
});
