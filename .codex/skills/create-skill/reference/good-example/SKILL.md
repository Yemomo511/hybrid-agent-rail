---
name: react-native-turbo-module
description: 创建或更新 React Native TurboModule，用于 App 内本地原生能力接入。适用于 RN App 需要在新架构下通过类型化 JS 访问 Android/iOS API，并完成 Spec 编写、Codegen 配置、Android Kotlin/Java 实现、iOS Objective-C++ 注册等场景。
metadata:
  version: react-native >= 0.74，基于 react-native 0.79 Turbo Native Modules 文档校准
  env: 已启用 React Native 新架构；具备 Android Gradle 与 iOS CocoaPods 环境
---

# React Native TurboModule

## 何时调用

当用户需要新增或修复 React Native 原生模块，且目标 App 应使用 TurboModule 而不是旧桥接时，使用该 Skill。

优先用于以下场景：

- App 内本地原生 API，例如存储、设备 API、SDK 包装、鉴权 token 或原生服务调用
- 为 React Native Codegen 设计类型化 TypeScript/Flow Spec
- 基于生成的 `Native*Spec` 实现 Android Kotlin 或 Java 模块
- 实现 iOS Objective-C++ 模块，并通过 `modulesProvider` 注册
- 排查 `generateCodegenArtifactsFromSchema`、生成 Spec 导入失败、TurboModule 注册缺失等构建问题

如果同一个模块必须同时支持旧架构和新架构，不要把该 Skill 作为默认实现路径。此时应先设计明确的向后兼容方案。

## 来源

- Upstream: https://reactnative.dev/docs/0.79/turbo-native-modules-introduction

## 工作流

1. 修改前先检查目标 App：
   - `package.json`：确认 React Native 版本和现有 `codegenConfig`
   - `android/app/build.gradle` 或 `android/app/build.gradle.kts`
   - `android/app/src/main/java/.../MainApplication.*`
   - `ios/Podfile`、`ios/*.xcworkspace` 和现有原生源码结构
2. 在 `specs/Native<Name>.ts` 下定义 JS 类型化 Spec。
3. 在 `package.json` 中新增或更新 `codegenConfig`。
4. 条件允许时，在编写原生实现前先生成 Codegen 产物。
5. 基于生成的 Spec 实现 Android module 和 package。
6. 基于生成的 Spec 实现 iOS Objective-C++ module，并通过 `modulesProvider` 注册。
7. 通过 `TurboModuleRegistry` 编写 JS 调用。
8. 验证 Android、iOS 与 JS 调用链路。

## 类型化 Spec 规则

创建以 `Native` 开头的 Spec 文件，例如 `specs/NativeDeviceToken.ts`。

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

当模块是必需能力，且注册错误应快速失败时，使用 `getEnforcing`。只有当能力是可选的，并且 JS 层有降级方案时，才使用 `get`。

保持 Spec 小而平台无关。不要直接暴露 Android/iOS 对象类型。优先使用 React Native Codegen 支持的字符串、数字、布尔值、数组、记录类型、回调或 promise。

## Codegen 配置

在 `package.json` 中新增单个 App 级 `codegenConfig`，或合并到已有配置中。

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

运行 Codegen：

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema
```

```bash
cd ios
bundle install
bundle exec pod install
```

Android 构建通常会自动运行 Codegen，但直接运行 Gradle 任务能暴露更清晰的失败面。iOS 的 Codegen 通过 CocoaPods script phases 接入，因此修改 Spec 或 `codegenConfig` 后需要重新运行 `pod install`。

## Android 实现

实现生成的 `NativeDeviceTokenSpec` 类。如果 App 已使用 Kotlin，优先使用 Kotlin；否则沿用项目当前的 Java/Kotlin 风格。

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

通过 `BaseReactPackage` 注册模块，并标记 `isTurboModule = true`。

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

除非该模块作为可 autolink 的库分发，否则需要在 `MainApplication` 中添加 package。

## iOS 实现

React Native TurboModule 适配层使用 Objective-C++，因为生成的 Spec 暴露了 Objective-C++ / C++ 集成点。如果 App 内部已有 Swift 业务逻辑，应从该适配层调用 Swift 实现，而不是用纯 Swift 替代适配层。

创建 `RCTNativeDeviceToken.h`：

```objc
#import <Foundation/Foundation.h>
#import <NativeDeviceTokenSpec/NativeDeviceTokenSpec.h>

NS_ASSUME_NONNULL_BEGIN

@interface RCTNativeDeviceToken : NSObject <NativeDeviceTokenSpec>

@end

NS_ASSUME_NONNULL_END
```

创建 `RCTNativeDeviceToken.mm`：

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

新增或重命名 iOS 模块后，更新 `codegenConfig.ios.modulesProvider`，重新运行 `bundle exec pod install`，打开生成的 workspace，并通过 Xcode 或 CLI 构建。

## JS 使用方式

在 App 层保留一个轻量包装，避免其他业务代码直接依赖生成模块细节。

```ts
import NativeDeviceToken from '../specs/NativeDeviceToken';

export const deviceTokenStorage = {
  getToken: () => NativeDeviceToken.getToken(),
  setToken: (value: string) => NativeDeviceToken.setToken(value),
  clearToken: () => NativeDeviceToken.clearToken(),
};
```

## 验证

先运行最窄且可靠的检查，再分别构建两个平台：

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

如果 App 存在 JS 类型检查或测试命令，也需要运行。运行时验收需要证明 JS 能在 Android 和 iOS 上调用每个 Spec 方法；如果模块查找失败，必须记录精确错误。

## 排障

- 如果 JS 报模块不可用，检查 Spec module name、`getName()` / `moduleName`、Android package 注册和 iOS `modulesProvider`。
- 如果 Android 无法导入 `Native*Spec`，重新运行 Codegen，并确认 `javaPackageName` 与原生 package 匹配。
- 如果 iOS 找不到 `Native*Spec/Native*Spec.h`，重新运行 `bundle exec pod install`，并构建 `.xcworkspace`，不要构建 `.xcodeproj`。
- 如果方法签名无法 override 生成方法，先修正 TS Spec 并重新生成产物；不要强行让原生签名适配过期的生成代码。

## 好例子

用户请求：

> 新增一个名为 `NativeDeviceToken` 的 TurboModule，用于在本地存储 device token，并允许 JS 获取、写入或清空该 token。

好的响应形态：

1. 检查 RN 版本、新架构状态、现有 `codegenConfig`、Android package 和 iOS workspace。
2. 新增 `specs/NativeDeviceToken.ts`，包含 `getToken`、`setToken` 和 `clearToken`。
3. 新增 `codegenConfig`，包含 `type: "modules"`、`jsSrcsDir: "specs"`、Android `javaPackageName` 和 iOS `modulesProvider`。
4. 如果项目能在本地构建，先运行 Codegen，再编写原生代码。
5. 实现 Android `NativeDeviceTokenModule` 和 `NativeDeviceTokenPackage`。
6. 实现 iOS `RCTNativeDeviceToken.h/.mm`，并重新运行 Pods。
7. 增加轻量 JS 包装和运行时冒烟路径。
8. 验证 Codegen、Android 构建、iOS 构建，以及 JS 类型检查或测试命令。
