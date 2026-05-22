---
name: rn-newarch-modules-create
description: 创建或改造 React Native New Architecture TurboModule 时使用。适用于用户要求创建 Turbo Native Module、配置 Codegen、实现 Android/iOS 原生模块、设计纯 C++ 跨端模块、判断 RN 0.68-0.85 不同版本支持方式，或在 RN 0.74+ 新架构项目中替代旧桥 NativeModule；版本、平台、模块分发形态或 Legacy 兼容目标不明确时必须先询问。
metadata:
    version: React Native 0.68-0.85, New Architecture, TurboModule
    env: Android, iOS, C++, Codegen, Community CLI, CocoaPods, Gradle
---

## Rn Newarch Modules Create

## Overview

创建或改造 React Native New Architecture TurboModule 时使用。先确认版本、模块形态和平台范围，再选择 Android/iOS 原生实现或 C++ 共享实现。

未明确新架构时：RN `0.74+` 可优先评估 TurboModule，但必须先确认项目是否启用或目标是否迁移到 New Architecture。

## When To Invoke

- 用户提到 TurboModule、Turbo Native Module、New Architecture Native Module、Codegen 或 `TurboModuleRegistry`。
- 用户要求把旧桥 NativeModule 迁移到新架构，或判断某个 RN 版本是否支持 TurboModule。
- 用户需要为 npm library 或 App 内模块配置 `codegenConfig`、Gradle、CocoaPods、`BaseReactPackage`、`RCTModuleProvider` 或 C++ provider。

## Stop Rule

缺少以下信息时先问，不要实现：

1. RN 版本：精确版本或版本范围，至少要能判断是否属于 `0.82+`、`0.76-0.81`、`0.74-0.75`、`0.68-0.73`。
2. 模块形态：App 内模块，还是独立 npm library。
3. 平台范围：Android、iOS、双端，或需要纯 C++ 跨端复用。
4. 架构目标：New Architecture only，还是必须兼容 Legacy Architecture。
5. JS spec：TypeScript 还是 Flow；模块名、方法签名、同步/异步/Promise/Event 需求是否已明确。
6. 原生依赖：是否接入已有 Android/iOS SDK、C++ 库、系统 API、线程/生命周期要求。

## Workflow

1. 读取项目事实：`package.json`、`codegenConfig`、`android/gradle.properties`、Gradle 文件、`MainApplication`、`ios/Podfile`、podspec。
2. 需要版本判断时读取 `references/version-support-matrix.md`。
3. 版本策略：
   - RN `0.82+`：只按 New Architecture/TurboModule 创建。
   - RN `0.76-0.81`：新模块默认 TurboModule；Legacy 兼容必须有明确原因。
   - RN `0.74-0.75`：先确认 New Architecture 是否启用。
   - RN `0.68-0.73`：按早期 opt-in 新架构处理，优先查版本参考。
   - RN `<0.68`：转为 Legacy NativeModule 兼容任务。
4. JS/Codegen：声明 `Spec extends TurboModule`；默认使用 typed `TurboModuleRegistry.getEnforcing`；配置 `codegenConfig.type = "modules"`、`jsSrcsDir`、Android `javaPackageName`。
5. Android/iOS：读取 `references/android-ios-turbomodule.md`；Android 实现 generated `NativeXxxSpec` 并用 `BaseReactPackage` 注册；iOS 实现 generated spec/protocol 并注册 provider。
6. C++：只有跨端复用、性能敏感或已有 C++ SDK 时读取 `references/cxx-turbomodule.md`。
7. 验收：Android Codegen 和 debug 构建通过；iOS `pod install` 和 Debug 构建通过；JS smoke 能取到模块；library 需要 example app 验证。

## Reference Routing

- `references/version-support-matrix.md`：判断 RN 版本分界、默认架构和是否需要 Legacy 兼容时读取。
- `references/android-ios-turbomodule.md`：实现 Android/iOS 平台 TurboModule 时读取。
- `references/cxx-turbomodule.md`：实现跨平台 C++ TurboModule 时读取。
- `references/source-links.md`：需要官方来源、release notes、ReactWG/issue 入口或相近版本资料时读取。

## Anti-Patterns

- 在 RN `0.82+` 中设计 Legacy Architecture opt-out。
- 新模块默认使用旧桥 `ReactContextBaseJavaModule`、`RCT_EXPORT_MODULE`，却没有明确 Legacy 兼容原因。
- 跳过 Codegen，直接手写 JS 和原生接口。
- iOS 需要 C++ 实现时仍把核心逻辑塞进 `.m` 文件；应使用 `.mm` 或共享 C++ provider。
- 只验证 Android 或只验证 iOS，却声称双端 TurboModule 已完成。
- 没有读取当前仓库 `package.json`/Podfile/Gradle 状态就照抄最新 RN 文档。
