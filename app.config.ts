import { ExpoConfig } from "expo/config";
// Update this value to something unique in order to be able to build for a
// physical iOS device.
const APP_ID_PREFIX = "dev.codewithbeto";

// These values are tied to EAS. If you would like to use EAS Build or Update
// on this project while playing with it, then remove these values and run
// `eas init` and `eas update:configure` to get new values for your account.
const EAS_UPDATE_URL =
  "https://u.expo.dev/66251e1b-0290-4ef8-87a4-e533cac914dd";
const EAS_PROJECT_ID = "66251e1b-0290-4ef8-87a4-e533cac914dd";
const EAS_APP_OWNER = "expo";

const IS_DEV = process.env.APP_VARIANT === "development";
const IS_PREVIEW = process.env.APP_VARIANT === "preview";

const getName = () => {
  if (IS_DEV) {
    return "React Conf (Dev)";
  }

  if (IS_PREVIEW) {
    return "React Conf (Prev)";
  }

  return "React Conf";
};

const getAppId = () => {
  if (IS_DEV) {
    return `${APP_ID_PREFIX}.dev`;
  }

  if (IS_PREVIEW) {
    return `${APP_ID_PREFIX}.preview`;
  }

  return `${APP_ID_PREFIX}.app`;
};

const config: ExpoConfig = {
  name: getName(),
  slug: "react-conf-app",
  version: "1.1.0",
  orientation: "portrait",
  icon: "./assets/app-icons/icon-default.png",
  userInterfaceStyle: "automatic",
  scheme: "reactconfapp",
  assetBundlePatterns: ["**/*"],
  newArchEnabled: true,
  ios: {
    icon: "./assets/app-icons/icon-default-ios.icon",
    supportsTablet: true,
    bundleIdentifier: getAppId(),
    userInterfaceStyle: "automatic",
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/app-icons/icon-default-android.png",
      monochromeImage: "./assets/app-icons/icon-monochrome-android.png",
      backgroundColor: "#000000",
    },
    userInterfaceStyle: "automatic",
    package: getAppId(),
    edgeToEdgeEnabled: true,
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  extra: {
    eas: {
      projectId: EAS_PROJECT_ID,
    },
  },
  owner: EAS_APP_OWNER,
  plugins: [
    "expo-asset",
    "expo-build-properties",
    "expo-web-browser",
    [
      "expo-quick-actions",
      {
        androidIcons: {
          layers: {
            foregroundImage: "./assets/icons/layers.png",
            backgroundColor: "#24272E",
          },
        },
      },
    ],
    "expo-router",
    [
      "expo-font",
      {
        fonts: [
          "./assets/fonts/FreightSansProBlack-Italic.ttf",
          "./assets/fonts/FreightSansProBlack-Regular.ttf",
          "./assets/fonts/FreightSansProBold-Italic.ttf",
          "./assets/fonts/FreightSansProBold-Regular.ttf",
          "./assets/fonts/FreightSansProBook-Italic.ttf",
          "./assets/fonts/FreightSansProBook-Regular.ttf",
          "./assets/fonts/FreightSansProLight-Italic.ttf",
          "./assets/fonts/FreightSansProLight-Regular.ttf",
          "./assets/fonts/FreightSansProMedium-Italic.ttf",
          "./assets/fonts/FreightSansProMedium-Regular.ttf",
          "./assets/fonts/FreightSansProSemiBold-Italic.ttf",
          "./assets/fonts/FreightSansProSemiBold-Regular.ttf",
        ],
      },
    ],
    [
      "react-native-bootsplash",
      {
        android: {
          parentTheme: "TransparentStatus",
          darkContentBarsStyle: false,
        },
      },
    ],
  ],
  updates: {
    url: EAS_UPDATE_URL,
    // Configure the channel to "local" for local development, if we
    // compile/run locally EAS Build will configure this for us automatically
    // based on the value provided in the build profile, and that will
    // overwrite this value.
    requestHeaders: {
      "expo-channel-name": "local",
    },
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  experiments: {
    reactCompiler: true,
  },
};

export default config;
