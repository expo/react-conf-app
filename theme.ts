import { Platform } from "react-native";

export const theme = {
  colorWhite: "#FFFFFF",
  colorBlack: "#051726",
  colorDarkBlue: "#051726",
  colorDarkestBlue: "#091725",
  colorLightGreen: "#9BDFB1",
  colorDarkGreen: "#1AC9A2",
  colorGrey: "#adb5bd",
  colorReactLightBlue: "#58C4DC",
  colorReactDarkBlue: "#087EA4",
  colorThemeLightGrey: "#FCFBFE",
  colorThemeGrey: "#F5F4F3",

  color: {
    text: { light: "#121212", dark: "#FFFFFF" },
    textSecondary: { light: "#808080", dark: "#808080" },
    background: { light: "#FFFFFF", dark: "#000000" },
    backgroundSecondary: {
      light: "rgba(18,18,18, 0.06)",
      dark: "rgba(255,255,255, 0.14)",
    },
    backgroundTertiary: {
      light: "rgba(18,18,18, 0.04)",
      dark: "rgba(255,255,255, 0.08)",
    },
  },

  darkActiveContent: "rgba(255,255,255, 0.3)",

  lightActiveContent: "rgba(0,0,0, 0.1)",

  space4: 4,
  space8: 8,
  space12: 12,
  space16: 16,
  space24: 24,

  fontSize16: 16,
  fontSize18: 18,
  fontSize24: 24,
  fontSize32: 32,

  fontFamilyLight: "FreightSansProLight-Regular",
  fontFamilyLightItalic: "FreightSansProLight-Italic",
  fontFamily: "FreightSansProBook-Regular",
  fontFamilyItalic: "FreightSansProBook-Italic",
  fontFamilySemiBold: "FreightSansProSemiBold-Regular",
  fontFamilySemiBoldItalic: "FreightSansProSemiBold-Italic",
  fontFamilyBold: "FreightSansProBold-Regular",
  fontFamilyBoldItalic: "FreightSansProBold-Italic",

  borderRadius6: 6,
  borderRadius10: 10,
  borderRadius12: 12,
  borderRadius20: 20,

  dropShadow: {
    ...Platform.select({
      ios: {
        shadowColor: "#adb5bd",
        shadowOffset: {
          width: 0,
          height: 0,
        },
        shadowOpacity: 0.4,
        shadowRadius: 2,
      },
      default: {},
    }),
  },
};
