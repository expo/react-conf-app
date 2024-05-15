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

// If you change this value, run `npx expo prebuild --clean` afterwards if you
// are building the project locally.
const IS_NEW_ARCH_ENABLED = false;

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

export default {
  expo: {
    name: getName(),
    slug: "react-conf-app",
    version: "1.0.3",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "automatic",
    scheme: "reactconfapp",
    assetBundlePatterns: ["**/*"],
    ios: {
      supportsTablet: true,
      bundleIdentifier: getAppId(),
      userInterfaceStyle: "automatic",
      config: {
        usesNonExemptEncryption: false,
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/icon-android-foreground.png",
        monochromeImage: "./assets/icon-android-foreground.png",
        backgroundColor: "#051726",
      },
      userInterfaceStyle: "automatic",
      package: getAppId(),
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
      [
        "expo-build-properties",
        {
          ios: {
            newArchEnabled: IS_NEW_ARCH_ENABLED,
          },
          android: {
            newArchEnabled: IS_NEW_ARCH_ENABLED,
          },
        },
      ],
      [
        "expo-quick-actions",
        {
          androidIcons: {
            gift: {
              foregroundImage: "./assets/icons/gift.png",
              backgroundColor: "#FFFFFF",
            },
          },
        },
      ],
      "expo-router",
      [
        "@config-plugins/react-native-dynamic-app-icon",
        ["./assets/icon.png", "./assets/icons/icon-desert.png"],
      ],
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
            "./assets/fonts/FreightSansProSemibold-Italic.ttf",
            "./assets/fonts/FreightSansProSemibold-Regular.ttf",
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
  },
};
