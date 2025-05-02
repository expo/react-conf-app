const { defineConfig, globalIgnores } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const reactCompiler = require("eslint-plugin-react-compiler");

module.exports = defineConfig([
  globalIgnores(["dist/*", "ios/*", "android/*", "lib/*"]),
  expoConfig,
  eslintPluginPrettierRecommended,
  reactCompiler.configs.recommended,
]);
