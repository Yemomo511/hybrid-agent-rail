# React Native Version And Architecture Reference

## Sources Checked

- React Native environment setup: https://reactnative.dev/docs/set-up-your-environment
- React Native 0.85 release: https://reactnative.dev/blog/2026/04/07/react-native-0.85
- React Native 0.76 New Architecture: https://reactnative.dev/blog/2024/10/23/the-new-architecture-is-here
- React Native 0.74 release: https://reactnative.dev/blog/2024/04/22/release-0.74
- React Native architecture landing page: https://reactnative.dev/architecture/landing-page
- Expo Continuous Native Generation: https://docs.expo.dev/workflow/continuous-native-generation/
- Expo prebuild: https://docs.expo.dev/workflow/prebuild/
- Expo native modules overview: https://docs.expo.dev/modules/overview/

## Version Split

### RN 0.85

- Treat as the current stable version when the official React Native docs version selector shows 0.85.
- Current CLI creation path is:
  ```bash
  npx @react-native-community/cli@latest init MyProject --version latest
  ```
- RN 0.85 release notes call out Node.js 20.19.4 as the minimum supported Node version.
- The Jest preset moved out of `react-native` into `@react-native/jest-preset`; new projects should follow the current template rather than copying older Jest config.
- Expo SDK 56 is expected to include RN 0.85. If the user wants Expo plus RN 0.85 before the matching Expo SDK is available locally, verify the actual installed Expo SDK compatibility first.

### RN 0.76-0.84

- RN 0.76 is the main turning point: New Architecture is enabled by default in new and existing projects.
- New Architecture means the app can use Fabric, TurboModules, the new renderer/event loop work, and modern concurrent React features.
- Legacy opt-out is still possible, but must be deliberate and documented. On Android this commonly appears as `newArchEnabled=false` in `android/gradle.properties`; on iOS the exact toggle depends on the project/template version.
- For native modules in this range, default to TurboModule or Fabric/native component planning unless the user has a legacy dependency that cannot migrate.

### RN 0.74-0.75

- RN 0.74 made Bridgeless Mode default when New Architecture is enabled.
- RN 0.74 also introduced Yoga 3.0, batched `onLayout` updates, Yarn 3 as the default package manager for Community CLI new projects, Android minimum SDK 23, and removal of Flipper native library setup from new templates.
- Do not assume New Architecture is enabled by default for every 0.74-0.75 project. Inspect `newArchEnabled`, Podfile flags, and template state.
- When creating or maintaining native modules, decide explicitly between old bridge APIs and New Architecture APIs.

### RN versions before 0.74

- Treat as compatibility work, not a normal modern greenfield default.
- Expect old bridge APIs, older Gradle/CocoaPods templates, possible Flipper setup, different Hermes defaults, and package-manager-specific hoisting issues.
- Ask why the user needs the older version before creating. Valid reasons include existing native SDK compatibility, company template constraints, or reproducing a historical app.
- If no hard compatibility reason exists, recommend creating on current stable RN and recording the tradeoff.

## Expo Versus Native CLI

### Expo managed or CNG

- Best for product apps that benefit from Expo Router, EAS Build, OTA updates, config plugins, SDK modules, and a managed workflow.
- `create-expo-app` starts without committed `android/` and `ios/` directories by default.
- `npx expo prebuild` generates native directories from Expo config. This is Continuous Native Generation: native projects are generated outputs unless the team decides to own them directly.
- Expo Go is not proof that custom native code works. Custom native modules require a development build or a prebuilt/native build.
- Prefer config plugins for repeatable native configuration.

### React Native Community CLI

- Best when the project must own native Android/iOS projects from day one.
- Good fit for deep native SDK integration, custom Gradle/CocoaPods/Xcode settings, direct native debugging, custom native modules, and teams with native release ownership.
- Requires local Android Studio/JDK/Gradle and Xcode/CocoaPods setup for full validation.
- New RN native modules should usually target TurboModule/Fabric on 0.76+ unless legacy compatibility is explicitly required.

### Existing Android/iOS app integrating RN

- Not the same as creating a standalone RN app.
- First design the host boundary: where RN screens mount, how bundles are loaded, how navigation crosses native/RN, how native dependencies are packaged, and how releases are versioned.
- Android work usually involves Gradle settings, `ReactNativeHost` or equivalent host setup, packages, activities/fragments, Hermes, and build variants.
- iOS work usually involves CocoaPods, `RCTBridge` or New Architecture host setup, `RCTRootView` or Fabric surface setup, bundle loading, app delegate integration, and scheme/signing rules.

## Native Module Decision Matrix

| Need | Expo Go | Expo development build or prebuild | Community CLI |
| --- | --- | --- | --- |
| Use built-in Expo SDK module | Good | Good | Possible but not usually needed |
| Add config-only native permission or manifest/plist change | Limited | Good through config plugins | Direct native edit |
| Add custom Android/iOS module | Not supported | Supported with native module plus dev build | Supported directly |
| Deep debug Gradle, Pods, Xcode, signing | Not enough | Possible after prebuild/dev build | Best fit |
| Keep generated native folders disposable | Good | Good with CNG discipline | Not applicable |
| Own native folders as source of truth | Poor fit | Possible but must abandon pure CNG assumptions | Best fit |

## Questions To Ask Before Creation

1. Do you want Expo managed/CNG, React Native Community CLI, or integration into an existing native app?
2. Do you want New Architecture, Legacy Architecture, or compatibility with a specific legacy native module?
3. Which RN version do you want: current stable 0.85, a specific version, or a pre-0.85 version for compatibility?
4. Which platforms must be created and validated: Android, iOS, or both?
5. Will the app need custom native modules, native views, background services, media SDKs, maps, payments, or push notifications at creation time?
6. Which package manager should be used? For RN projects prefer `yarn` unless the user or template requires otherwise.
