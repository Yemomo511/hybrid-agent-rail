---
description: "创建或改造 React Native New Architecture TurboModule 时使用。适用于用户要求创建 Turbo Native Module、配置 Codegen、实现 Android/iOS 原生模块、设计纯 C++ 跨端模块、判断 RN 0.68-0.85 不同版本支持方式，或在 RN 0.74+ 新架构项目中替代旧桥 NativeModule；版本、平台、模块分发形态或 Legacy 兼容目标不明确时必须先询问。 版本要求: React Native 0.68-0.85, New Architecture, TurboModule。环境要求: Android, iOS, C++, Codegen, Community CLI, CocoaPods, Gradle。"
metadata:
  env: Android, iOS, C++, Codegen, Community CLI, CocoaPods, Gradle
  version: React Native 0.68-0.85, New Architecture, TurboModule
name: rn-newarch-modules-create
---

## Pre Requirement(必读)
当要求不符合时，禁止使用该 Skill。
- 版本要求: React Native 0.68-0.85, New Architecture, TurboModule
- 环境要求: Android, iOS, C++, Codegen, Community CLI, CocoaPods, Gradle

## Rn Newarch Modules Create

## Overview
使用这个 Skill 创建 React Native New Architecture TurboModule。先确认 RN 版本、模块边界和平台范围，再选择 Android/iOS 平台实现或纯 C++ 跨端实现，避免把旧桥 NativeModule 模板套进新架构项目。

** 当用户没有明确指示使用新架构时，推荐react-native 版本 >= 0.74 考虑使用**

## When To Invoke

- 用户提到 TurboModule、Turbo Native Module、New Architecture Native Module、Codegen 或 `TurboModuleRegistry`。
- 用户需要在 Android、iOS 或 C++ 中创建 RN 原生能力，并要求兼容 RN 0.68-0.85。
- 用户要求把旧桥 NativeModule 迁移到新架构，或判断某个 RN 版本是否支持 TurboModule。
- 用户需要为 npm library 或 App 内模块配置 `codegenConfig`、Gradle、CocoaPods、`BaseReactPackage`、`RCTModuleProvider` 或 C++ provider。

## Stop Rule

如果以下信息缺失，先停止实现，只问最少必要问题：

1. RN 版本：精确版本或版本范围，至少要能判断是否属于 `0.82+`、`0.76-0.81`、`0.74-0.75`、`0.68-0.73`。
2. 模块形态：App 内模块，还是独立 npm library。
3. 平台范围：Android、iOS、双端，或需要纯 C++ 跨端复用。
4. 架构目标：New Architecture only，还是必须兼容 Legacy Architecture。
5. JS spec：TypeScript 还是 Flow；模块名、方法签名、同步/异步/Promise/Event 需求是否已明确。
6. 原生依赖：是否接入已有 Android/iOS SDK、C++ 库、系统 API、线程/生命周期要求。

## Workflow

1. 读取当前项目事实。
   - 检查 `package.json` 中 `react-native` 版本、`codegenConfig`、包名和是否是 workspace/library。
   - 检查 `android/gradle.properties` 的 `newArchEnabled`，Android Gradle 文件和 `MainApplication` 包注册方式。
   - 检查 `ios/Podfile`、podspec、`RCT_NEW_ARCH_ENABLED` 相关逻辑和是否已有 Codegen 输出。
   - 如果版本或架构不确定，读取 `references/version-support-matrix.md`。

2. 选择版本策略。
   - RN `0.82+`：只按 New Architecture/TurboModule 创建；不要设计 Legacy opt-out。
   - RN `0.76-0.81`：新模块默认按 TurboModule 创建；只有明确迁移约束时才读取兼容指南并保留 Legacy 兼容。
   - RN `0.74-0.75`：先确认 New Architecture 是否启用；Bridgeless 只在 New Architecture 启用时默认开启。
   - RN `0.68-0.73`：按早期 opt-in 新架构处理，优先读取 archived docs/ReactWG 资料，不直接套用最新模板。
   - RN `<0.68`：说明这不是该 Skill 的主路径，转为 Legacy NativeModule 兼容任务。

3. 设计 JS spec 和 Codegen。
   - 在 `specs/NativeXxx.ts` 或 library 的 spec 目录中声明 `Spec extends TurboModule`。
   - 默认使用 `TurboModuleRegistry.getEnforcing` 并传入 typed `Spec`；可选模块才使用 `TurboModuleRegistry.get`。
   - `package.json` 添加或修正 `codegenConfig`，模块使用 `type: "modules"`，并设置 `jsSrcsDir` 与 Android `javaPackageName`。
   - App 内模块和 npm library 的 spec 目录、包名、生成产物路径不同，先与当前仓库结构对齐。

4. 实现 Android/iOS 平台模块。
   - Android 读取 `references/android-ios-turbomodule.md`，实现 generated `NativeXxxSpec`，用 `BaseReactPackage` 注册，并在 `ReactModuleInfo` 中标记 `isTurboModule=true`。
   - iOS 读取 `references/android-ios-turbomodule.md`，实现 generated protocol/spec，并通过 `RCTModuleProvider` 或 `modulesProvider` 将模块名映射到 provider。
   - 新增 Android Gradle 配置时遵循本仓库跨端规范，优先使用 Kotlin DSL `.kts`。

5. 实现纯 C++ 模块。
   - 只有当模块逻辑需要跨 Android/iOS 复用、性能敏感或已有 C++ SDK 时选择该路径。
   - 读取 `references/cxx-turbomodule.md`，把共享逻辑放入 C++，分别完成 Android `CMakeLists.txt`/`OnLoad.cpp` 注册和 iOS provider 注册。
   - RN 0.76 之后不要继续依赖已移除的 iOS experimental C++ autolinking macro。

6. 验证。
   - Android：运行 `./gradlew generateCodegenArtifactsFromSchema`，再运行一次 debug 构建或目标 app 构建。
   - iOS：运行 `bundle exec pod install` 或项目约定的 `pod install`，确认 Codegen script phase 生成，再运行 Debug 构建。
   - JS：运行项目测试或最小调用 smoke，确认 `TurboModuleRegistry` 能取到模块。
   - 如果是 library，额外在 example app 中验证 autolinking、Codegen 和双端构建。

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

## Good Example

用户说：“在 RN 0.82 的现有 App 里新增一个双端 `NativeDeviceInfo` TurboModule，Android/iOS 都走原生实现，不需要旧架构。”

正确处理：

1. 确认 RN 0.82+ 和 New Architecture only。
2. 创建 `specs/NativeDeviceInfo.ts`，声明 `Spec extends TurboModule`，并用 typed `TurboModuleRegistry.getEnforcing` 导出 `NativeDeviceInfo`。
3. 在 `package.json` 配置 `codegenConfig.type = "modules"`、`jsSrcsDir` 和 Android `javaPackageName`。
4. Android 实现 generated `NativeDeviceInfoSpec`，通过 `BaseReactPackage` 和 `ReactModuleInfo(isTurboModule=true)` 注册。
5. iOS 实现 generated spec/protocol，使用 provider 将 `NativeDeviceInfo` 映射到模块实例。
6. 运行 Android Codegen/build、iOS pod install/build，并用 JS smoke 调用确认模块存在。
