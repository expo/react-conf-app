import { Platform, StyleSheet, View } from "react-native";
import { Image } from "expo-image";
import { theme } from "@/theme";
import { ThemedText, ThemedView, useThemeColor } from "./Themed";
import { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";

const effects = [
  {
    name: "None - image 1",
    effect: null,
    image: require("../assets/images/react-blue.png"),
  },
  {
    name: "Cross Dissolve - image 2",
    effect: "cross-dissolve",
    image: require("../assets/images/react-green.png"),
  },
  {
    name: Platform.select({
      ios: "Flip From Right - image 3",
      default: "Cross Dissolve - image 3",
    }),
    effect: Platform.select({
      ios: "flip-from-right",
      default: "cross-dissolve",
    }),
    image: require("../assets/images/react-dark-blue.png"),
  },
  {
    name: Platform.select({
      ios: "Curl Down - image 4",
      default: "Cross Dissolve - image 4",
    }),
    effect: Platform.select({
      ios: "curl-down",
      default: "cross-dissolve",
    }),
    image: require("../assets/images/react-orange.png"),
  },
];

export function ExpoImageDemo() {
  const [imageEffect, setImageEffect] = useState<(typeof effects)[number]>(
    effects[0],
  );

  const radioColor = useThemeColor({
    light: theme.colorBlack,
    dark: theme.colorWhite,
  });

  return (
    <>
      <ThemedText
        style={styles.centered}
        marginBottom={theme.space12}
        fontWeight="bold"
        fontSize={24}
      >
        Expo Image Transitions
      </ThemedText>
      <ThemedView
        darkColor="rgba(255,255,255,0.15)"
        lightColor={theme.lightActiveContent}
        style={styles.section}
      >
        <Image
          style={{
            width: 250,
            height: 250,
            alignSelf: "center",
            backgroundColor: theme.colorBlack,
            marginBottom: theme.space24,
          }}
          source={imageEffect?.image}
          transition={
            imageEffect?.effect
              ? {
                  effect: imageEffect.effect as any,
                  duration: 500,
                  timing: "ease-in-out",
                }
              : null
          }
        />
        {effects.map((effect) => (
          <TouchableOpacity
            style={styles.option}
            onPress={() => {
              setImageEffect(effect);
            }}
            key={effect.name}
          >
            <View style={[styles.radioOuter, { borderColor: radioColor }]}>
              {effect === imageEffect ? (
                <View
                  style={[styles.radioInner, { backgroundColor: radioColor }]}
                />
              ) : null}
            </View>

            <ThemedText fontWeight={effect === imageEffect ? "bold" : "medium"}>
              {effect.name || "None"}
            </ThemedText>
          </TouchableOpacity>
        ))}
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    alignSelf: "center",
  },
  section: {
    padding: theme.space24,
    marginBottom: theme.space24,
  },
  centered: {
    textAlign: "center",
  },
  option: {
    flexDirection: "row",
    marginBottom: theme.space8,
    alignItems: "center",
  },
  radioOuter: {
    height: 24,
    width: 24,
    borderWidth: 2,
    borderRadius: 24,
    marginRight: theme.space8,
    justifyContent: "center",
    alignItems: "center",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 12,
  },
});
