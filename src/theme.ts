import { Platform } from "react-native";
import * as Device from "expo-device";

const SPACE_SCALE = 1.33;
const FONT_SCALE = 1.2;

const isIpad = Device.osName === "iPadOS";
const spaceScale = (value: number) =>
  isIpad ? Math.round(value * SPACE_SCALE) : value;
const fontScale = (size: number) =>
  isIpad ? Math.round(size * FONT_SCALE) : size;

export const theme = {
  colorRed: "#FF0000",
  colorWhite: "#FFFFFF",
  colorBlack: "#000000",
  colorLightGreen: "#9BDFB1",
  colorDarkGreen: "#1AC9A2",
  colorGrey: "#ADB5BD",

  color: {
    reactBlue: {
      light: "#087EA4",
      dark: "#58C4DC",
    },
    transparent: {
      light: "rgba(255,255,255,0)",
      dark: "rgba(0,0,0,0)",
    },
    text: { light: "#121212", dark: "#FFFFFF" },
    textSecondary: { light: "#808080", dark: "#CCCCCC" },
    background: { light: "#FFFFFF", dark: "#000000" },
    backgroundSecondary: {
      light: "#f1f1f1",
      dark: "#242424",
    },
    backgroundTertiary: {
      light: "#f5f5f5",
      dark: "#141414",
    },
    backgroundElement: {
      light: "#F1F1F1",
      dark: "#141414",
    },
    border: { light: "#D9D9D0", dark: "#363A3F" },
  },

  darkActiveContent: "rgba(255,255,255, 0.3)",

  lightActiveContent: "rgba(0,0,0, 0.1)",

  space4: spaceScale(4),
  space8: spaceScale(8),
  space12: spaceScale(12),
  space16: spaceScale(16),
  space24: spaceScale(24),

  fontSize10: fontScale(10),
  fontSize12: fontScale(12),
  fontSize14: fontScale(14),
  fontSize16: fontScale(16),
  fontSize18: fontScale(18),
  fontSize20: fontScale(20),
  fontSize24: fontScale(24),
  fontSize28: fontScale(28),
  fontSize32: fontScale(32),
  fontSize34: fontScale(34),
  fontSize42: fontScale(42),

  fontFamilyLight: "FreightSansProLight-Regular",
  fontFamilyLightItalic: "FreightSansProLight-Italic",
  fontFamily: "FreightSansProBook-Regular",
  fontFamilyItalic: "FreightSansProBook-Italic",
  fontFamilySemiBold: "FreightSansProSemiBold-Regular",
  fontFamilySemiBoldItalic: "FreightSansProSemiBold-Italic",
  fontFamilyBold: "FreightSansProBold-Regular",
  fontFamilyBoldItalic: "FreightSansProBold-Italic",

  borderRadius4: 4,
  borderRadius6: 6,
  borderRadius10: 10,
  borderRadius12: 12,
  borderRadius20: 20,
  borderRadius32: 32,
  borderRadius34: 34,
  borderRadius40: 40,
  borderRadius45: 45,
  borderRadius80: 80,

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
