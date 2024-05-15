import React from "react";
import { Text, View, useColorScheme, TextStyle } from "react-native";
import Animated from "react-native-reanimated";

import { theme } from "../theme";

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & {
  marginBottom?: number;
  fontSize?: TextStyle["fontSize"];
  fontWeight?: "light" | "medium" | "bold";
  italic?: boolean;
  animated?: boolean;
} & Text["props"];
export type ViewProps = ThemeProps & View["props"] & { animated?: boolean };

export function useThemeColor<T, U>(props: { light: T; dark: U }) {
  const theme = useColorScheme() ?? "light";
  // const theme = "dark";
  return props[theme];
}

export function ThemedText(props: TextProps) {
  const {
    style,
    lightColor,
    darkColor,
    marginBottom = 0,
    fontSize = theme.fontSize16,
    fontWeight,
    italic,
    animated,
    ...otherProps
  } = props;
  const color = useThemeColor({
    light: lightColor || theme.colorBlack,
    dark: darkColor || theme.colorWhite,
  });
  const fontFamily = (() => {
    if (fontWeight === "light") {
      return italic ? theme.fontFamilyLightItalic : theme.fontFamilyLight;
    } else if (fontWeight === "bold") {
      return italic ? theme.fontFamilyBoldItalic : theme.fontFamilyBold;
    } else {
      return italic ? theme.fontFamilyItalic : theme.fontFamily;
    }
  })();

  if (animated) {
    return (
      <Animated.Text
        style={[{ color, marginBottom, fontSize, fontFamily }, style]}
        {...otherProps}
      />
    );
  }

  return (
    <Text
      style={[{ color, marginBottom, fontSize, fontFamily }, style]}
      {...otherProps}
    />
  );
}

export function ThemedView(props: ViewProps) {
  const { style, lightColor, darkColor, animated, ...otherProps } = props;
  const backgroundColor = useThemeColor({
    light: lightColor || "transparent",
    dark: darkColor || "transparent",
  });

  if (animated) {
    return (
      <Animated.View style={[{ backgroundColor }, style]} {...otherProps} />
    );
  }

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
