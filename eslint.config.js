const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const reactCompiler = require("eslint-plugin-react-compiler");
const reactNativePlugin = require("eslint-plugin-react-native");

module.exports = defineConfig([
  globalIgnores(["dist/*", "ios/*", "android/*", "lib/*"]),
  expoConfig,
  eslintPluginPrettierRecommended,
  reactCompiler.configs.recommended,
  {
    plugins: {
      "react-native": reactNativePlugin,
    },
    languageOptions: {
      globals: {
        ...reactNativePlugin.environments["react-native"].globals,
      },
    },
    rules: {
      "react-native/no-unused-styles": "error",

      // TODO: (Kadi) separate PR to enable these
      // "react-native/sort-styles": "error",
      // "react-native/split-platform-components": "error",
      // "react-native/no-inline-styles": "error",
      // "react-native/no-color-literals": "error",
      // "react-native/no-raw-text": "error",
      // "react-native/no-single-element-style-arrays": "error",
    },
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: "./tsconfig.json",
        },
      },
      "react-native/style-sheet-object-names": ["StyleSheet", "EStyleSheet"],
    },
  },
]);
