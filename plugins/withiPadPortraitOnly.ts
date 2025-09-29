import { ConfigPlugin, withInfoPlist } from "expo/config-plugins";

const withiPadPortraitOnly: ConfigPlugin = (config) => {
  return withInfoPlist(config, (config) => {
    config.modResults["UISupportedInterfaceOrientations~ipad"] = [
      "UIInterfaceOrientationPortrait",
      "UIInterfaceOrientationPortraitUpsideDown",
    ];
    return config;
  });
};

export default withiPadPortraitOnly;
