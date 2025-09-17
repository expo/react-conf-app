# Conference App for React Conf 2025

This is the source code for the React Conf 2025 app. Download it from stores: [Google Play](https://play.google.com/store/apps/details?id=com.reactconf.app), [App Store](https://apps.apple.com/gb/app/react-conf/id6499559897).

To run the app locally, clone the repo and install dependencies with [Bun](https://bun.sh/) `bun install`. Next, either [compile and run it locally](#compile-and-run-locally) or [build and run it with EAS](#build-and-run-with-eas).

## Compile and run locally

To compile the app locally, you will need to have Xcode ([learn more](https://docs.expo.dev/guides/local-app-development/#ios)) and/or Android ([learn more](https://docs.expo.dev/guides/local-app-development/#android)) toolchains installed and configured.

> [!NOTE]
> In order to be able to sign the app for an iOS device with a development certificate, you need a unique bundle identifier. Change the `APP_ID_PREFIX` in **app.config.js** to a unique ID, such as `yourname.reactconf`. Run `npx expo prebuild --clean` when you've updated the value to sync it to the native project.

### Android

```sh
# Generate the `android/` directory
npx expo prebuild -p android

# Compile with Gradle
npx expo run:android
# Alternatively, start the dev server and manually open in Android Studio and build
npx expo start
```

### iOS

```sh
# Generate the `ios/` directory
npx expo prebuild -p ios

# Compile with xcodebuild and run on simulator.
npx expo run:ios
# Alternatively, start the dev server and manually open Xcode and build
npx expo start
```

For development on the Android Emulator / iOS Simulator:

## Build and run with EAS

### Initial configuration

In order to run a build with EAS, you will need to update the EAS owner and project ID fields in **app.config.js**. Change the `EAS_APP_OWNER`, `EAS_PROJECT_ID`, and `EAS_UPDATE_URL` to empty strings, then run `eas init` and `eas update:configure` to get the new values for your username (never used EAS before? [look at this guide](https://docs.expo.dev/build/setup/)).

### Android

```sh
# Create a development build. When it's completed, you will be prompted to install it
eas build --platform android --profile localdev
# Create a preview build. This is like a production build, but intended to be
# installed directly to your device
eas build --platform android --profile preview
```

### iOS

```sh
# Create a development build. When it's completed, you will be prompted to install it
eas build --platform ios --profile localdev
# Create a preview build. This is like a production build, but intended to be
# installed directly to your device
eas build --platform ios --profile preview
```

## Learn more

- [Get started with Expo](https://docs.expo.dev/get-started/introduction/).
- Check out the [Expo "Getting Started" tutorial](https://docs.expo.dev/tutorial/introduction/).
- Check out the [EAS Tutorial](https://docs.expo.dev/tutorial/eas/introduction/) or the [EggHead course](https://egghead.io/courses/build-and-deploy-react-native-apps-with-expo-eas-85ab521e).