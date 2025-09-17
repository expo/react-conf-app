import React from "react";
import { Text, View, useColorScheme, TextStyle } from "react-native";
import Animated from "react-native-reanimated";

import { theme } from "../theme";

type ThemeProps = {
  color?: { light: string; dark: string };

  // TODO (Kadi): Remove these props
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & {
  marginBottom?: number;
  fontSize?: TextStyle["fontSize"];
  fontWeight?: "light" | "medium" | "semiBold" | "bold";
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
    color: themeColor,
    ...otherProps
  } = props;

  const color = useThemeColor(themeColor ?? theme.color.text);

  const fontFamily = (() => {
    if (fontWeight === "light") {
      return italic ? theme.fontFamilyLightItalic : theme.fontFamilyLight;
    } else if (fontWeight === "semiBold") {
      return italic ? theme.fontFamilySemiBoldItalic : theme.fontFamilySemiBold;
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
  const { style, animated, ...otherProps } = props;
  const backgroundColor = useThemeColor(props.color ?? theme.color.background);

  if (animated) {
    return (
      <Animated.View style={[{ backgroundColor }, style]} {...otherProps} />
    );
  }

  return <View style={[{ backgroundColor }, style]} {...otherProps} />;
}
