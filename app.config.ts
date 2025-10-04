import { ExpoConfig } from "expo/config";
// Update this value to something unique in order to be able to build for a
// physical iOS device.
const APP_ID_PREFIX = "com.reactconf";

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
  version: "1.1.2",
  orientation: "portrait",
  icon: "./assets/app-icons/icon-default.png",
  userInterfaceStyle: "automatic",
  scheme: "reactconfapp",
  assetBundlePatterns: ["**/*"],
  newArchEnabled: true,
  ios: {
    icon: "./assets/app-icons/react-conf.icon",
    supportsTablet: true,
    bundleIdentifier: getAppId(),
    userInterfaceStyle: "automatic",
    config: {
      usesNonExemptEncryption: false,
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/app-icons/icon-android.png",
      monochromeImage: "./assets/app-icons/icon-monochrome-android.png",
      backgroundColor: "#087EA4",
    },
    userInterfaceStyle: "automatic",
    package: getAppId(),
    edgeToEdgeEnabled: true,
    softwareKeyboardLayoutMode: "pan",
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
    [
      "expo-build-properties",
      {
        android: {
          reactNativeReleaseLevel: "experimental",
        },
        ios: {
          reactNativeReleaseLevel: "experimental",
        },
      },
    ],
    "expo-web-browser",
    "expo-router",
    [
      "expo-font",
      {
        fonts: [
          "./assets/fonts/Montserrat-Light.ttf",
          "./assets/fonts/Montserrat-LightItalic.ttf",

          "./assets/fonts/Montserrat-Medium.ttf",
          "./assets/fonts/Montserrat-MediumItalic.ttf",

          "./assets/fonts/Montserrat-Bold.ttf",
          "./assets/fonts/Montserrat-BoldItalic.ttf",

          "./assets/fonts/Montserrat-SemiBold.ttf",
          "./assets/fonts/Montserrat-SemiBoldItalic.ttf",
        ],
      },
    ],
    [
      "expo-splash-screen",
      {
        backgroundColor: "#23272F",
        image: "./assets/splash-icon.png",
        imageWidth: 190,
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
