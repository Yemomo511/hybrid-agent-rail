---
name: react-native-turbo-module
description: Create or update a React Native TurboModule for app-local native capabilities. Use when an RN app needs typed JS access to Android/iOS APIs through the New Architecture, including Spec authoring, Codegen wiring, Android Kotlin/Java implementation, and iOS Objective-C++ registration.
metadata:
  version: react-native >= 0.74, verified against react-native 0.79 Turbo Native Modules docs
  env: React Native New Architecture enabled; Android Gradle and iOS CocoaPods available
---

# React Native TurboModule

## When To Invoke

Use this Skill when the user asks to add or repair a React Native native module and the target app should use TurboModule instead of the legacy bridge.

Prefer this Skill for:

- app-local native APIs such as storage, device APIs, SDK wrappers, auth tokens, or native service calls
- typed TypeScript/Flow Spec design for React Native Codegen
- Android Kotlin or Java implementation of generated `Native*Spec`
- iOS Objective-C++ implementation and `modulesProvider` registration
- build failures around `generateCodegenArtifactsFromSchema`, generated Spec imports, or missing TurboModule registration

Do not use it as the default path when the app must support Legacy Architecture and New Architecture with the same module. In that case, first design an explicit backwards-compatibility plan.

## Source

- Upstream: https://reactnative.dev/docs/0.79/turbo-native-modules-introduction

## Workflow

1. Inspect the target app before editing:
   - `package.json` for React Native version and existing `codegenConfig`
   - `android/app/build.gradle` or `android/app/build.gradle.kts`
   - `android/app/src/main/java/.../MainApplication.*`
   - `ios/Podfile`, `ios/*.xcworkspace`, and existing native source layout
2. Define the JS typed Spec under `specs/Native<Name>.ts`.
3. Add or update `codegenConfig` in `package.json`.
4. Generate Codegen artifacts before native implementation if possible.
5. Implement Android module and package against the generated Spec.
6. Implement iOS Objective-C++ module against the generated Spec and register it through `modulesProvider`.
7. Write JS usage through `TurboModuleRegistry`.
8. Validate Android, iOS, and JS call paths.

## Typed Spec Rules

Create a Spec file whose module name starts with `Native`, for example `specs/NativeDeviceToken.ts`.

```ts
import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export interface Spec extends TurboModule {
  getToken(): string | null;
  setToken(value: string): void;
  clearToken(): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeDeviceToken');
```

Use `getEnforcing` when the module is required and the app should fail fast if registration is broken. Use `get` only when the feature is optional and JS has a fallback.

Keep the Spec small and platform-neutral. Do not expose Android/iOS object types directly. Prefer strings, numbers, booleans, arrays, records, callbacks, or promises supported by React Native Codegen.

## Codegen Config

Update `package.json` with a single app-level `codegenConfig` entry or merge into the existing one.

```json
{
  "codegenConfig": {
    "name": "NativeDeviceTokenSpec",
    "type": "modules",
    "jsSrcsDir": "specs",
    "android": {
      "javaPackageName": "com.example.devicetoken"
    },
    "ios": {
      "modulesProvider": {
        "NativeDeviceToken": "RCTNativeDeviceToken"
      }
    }
  }
}
```

Run Codegen:

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema
```

```bash
cd ios
bundle install
bundle exec pod install
```

Android builds usually run Codegen automatically, but running the Gradle task directly gives a clearer failure surface. iOS Codegen is wired through the CocoaPods script phases, so rerun `pod install` after changing the Spec or `codegenConfig`.

## Android Implementation

Implement the generated `NativeDeviceTokenSpec` class. Kotlin is preferred when the app already uses Kotlin; otherwise follow the app's current Java/Kotlin style.

```kotlin
package com.example.devicetoken

import android.content.Context
import com.facebook.react.bridge.ReactApplicationContext

class NativeDeviceTokenModule(
  reactContext: ReactApplicationContext,
) : NativeDeviceTokenSpec(reactContext) {
  override fun getName() = NAME

  override fun getToken(): String? {
    return reactApplicationContext
      .getSharedPreferences("device_token", Context.MODE_PRIVATE)
      .getString("token", null)
  }

  override fun setToken(value: String) {
    reactApplicationContext
      .getSharedPreferences("device_token", Context.MODE_PRIVATE)
      .edit()
      .putString("token", value)
      .apply()
  }

  override fun clearToken() {
    reactApplicationContext
      .getSharedPreferences("device_token", Context.MODE_PRIVATE)
      .edit()
      .remove("token")
      .apply()
  }

  companion object {
    const val NAME = "NativeDeviceToken"
  }
}
```

Register the module through `BaseReactPackage` and mark `isTurboModule = true`.

```kotlin
package com.example.devicetoken

import com.facebook.react.BaseReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.module.model.ReactModuleInfo
import com.facebook.react.module.model.ReactModuleInfoProvider

class NativeDeviceTokenPackage : BaseReactPackage() {
  override fun getModule(
    name: String,
    reactContext: ReactApplicationContext,
  ): NativeModule? {
    return if (name == NativeDeviceTokenModule.NAME) {
      NativeDeviceTokenModule(reactContext)
    } else {
      null
    }
  }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      NativeDeviceTokenModule.NAME to ReactModuleInfo(
        NativeDeviceTokenModule.NAME,
        NativeDeviceTokenModule.NAME,
        false,
        false,
        false,
        true,
      ),
    )
  }
}
```

Add the package in `MainApplication` unless the module is distributed as an autolinked library.

## iOS Implementation

Use Objective-C++ for the React Native TurboModule adapter because the generated Spec exposes Objective-C++ / C++ integration points. If the app has Swift business logic, call it from this adapter rather than replacing the adapter with pure Swift.

Create `RCTNativeDeviceToken.h`:

```objc
#import <Foundation/Foundation.h>
#import <NativeDeviceTokenSpec/NativeDeviceTokenSpec.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTNativeDeviceToken : NSObject <NativeDeviceTokenSpec>

@end

NS_ASSUME_NONNULL_END
```

Create `RCTNativeDeviceToken.mm`:

```objc
#import "RCTNativeDeviceToken.h"

static NSString *const RCTNativeDeviceTokenSuite = @"device-token";
static NSString *const RCTNativeDeviceTokenKey = @"token";

@interface RCTNativeDeviceToken ()

@property (strong, nonatomic) NSUserDefaults *storage;

@end

@implementation RCTNativeDeviceToken

- (instancetype)init
{
  if (self = [super init]) {
    _storage = [[NSUserDefaults alloc] initWithSuiteName:RCTNativeDeviceTokenSuite];
  }
  return self;
}

- (std::shared_ptr<facebook::react::TurboModule>)getTurboModule:
    (const facebook::react::ObjCTurboModule::InitParams &)params
{
  return std::make_shared<facebook::react::NativeDeviceTokenSpecJSI>(params);
}

- (NSString * _Nullable)getToken
{
  return [self.storage stringForKey:RCTNativeDeviceTokenKey];
}

- (void)setToken:(NSString *)value
{
  [self.storage setObject:value forKey:RCTNativeDeviceTokenKey];
}

- (void)clearToken
{
  [self.storage removeObjectForKey:RCTNativeDeviceTokenKey];
}

+ (NSString *)moduleName
{
  return @"NativeDeviceToken";
}

@end
```

After adding or renaming the iOS module, update `codegenConfig.ios.modulesProvider`, rerun `bundle exec pod install`, open the generated workspace, and build from Xcode or CLI.

## JS Usage

Keep JS usage behind a small app-level wrapper so the rest of the app does not depend on generated module details.

```ts
import NativeDeviceToken from '../specs/NativeDeviceToken';

export const deviceTokenStorage = {
  getToken: () => NativeDeviceToken.getToken(),
  setToken: (value: string) => NativeDeviceToken.setToken(value),
  clearToken: () => NativeDeviceToken.clearToken(),
};
```

## Validation

Run the narrowest reliable checks first, then build both platforms:

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema
./gradlew assembleDebug
```

```bash
cd ios
bundle exec pod install
xcodebuild -workspace TurboModuleExample.xcworkspace -scheme TurboModuleExample -configuration Debug -sdk iphonesimulator build
```

Also run the app's JS typecheck/test command if it exists. For runtime acceptance, prove that JS can call every Spec method on Android and iOS, and capture the exact error if module lookup fails.

## Troubleshooting

- If JS throws that the module is unavailable, check the Spec module name, `getName()` / `moduleName`, Android package registration, and iOS `modulesProvider`.
- If Android cannot import `Native*Spec`, rerun Codegen and verify `javaPackageName` matches the native package.
- If iOS cannot find `Native*Spec/Native*Spec.h`, rerun `bundle exec pod install` and build the `.xcworkspace`, not the `.xcodeproj`.
- If method signatures do not override generated methods, fix the TS Spec first and regenerate artifacts; do not force native signatures to compile against stale generated code.

## Good Example

User request:

> Add a TurboModule named `NativeDeviceToken` that stores a device token locally and can get, set, or clear it from JS.

Good response shape:

1. Inspect RN version, New Architecture status, existing `codegenConfig`, Android package, and iOS workspace.
2. Add `specs/NativeDeviceToken.ts` with `getToken`, `setToken`, and `clearToken`.
3. Add `codegenConfig` with `type: "modules"`, `jsSrcsDir: "specs"`, Android `javaPackageName`, and iOS `modulesProvider`.
4. Run Codegen before writing native code if the project can build locally.
5. Implement Android `NativeDeviceTokenModule` plus `NativeDeviceTokenPackage`.
6. Implement iOS `RCTNativeDeviceToken.h/.mm` and rerun Pods.
7. Add a small JS wrapper and a runtime smoke path.
8. Verify Codegen, Android build, iOS build, and JS type/test command.
