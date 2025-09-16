import * as WebBrowser from "expo-web-browser";
import { Appearance } from "react-native";

import { theme } from "@/theme";

export default function openBrowserAsync(url: string) {
  const colorScheme = Appearance.getColorScheme();

  WebBrowser.openBrowserAsync(url, {
    enableBarCollapsing: true,
    ...(colorScheme === "dark"
      ? {
          // Optional: we could match this to theme
          toolbarColor: theme.colorBlack,
          controlsColor: "#fff",
        }
      : {
          // Optional: we could match this to theme
          controlsColor: theme.colorBlack,
        }),
  });
}
