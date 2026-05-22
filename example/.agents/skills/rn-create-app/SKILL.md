---
description: "创建或初始化 React Native 应用前使用。适用于用户要求新建 RN App、选择 Expo 或 React Native Community CLI、判断 New Architecture 或 Legacy Architecture、配置 Android/iOS 原生工程、接入原生模块、从 0.74 到 0.85 选择版本时；若用户没有明确目标架构和平台范围，必须先询问，禁止直接创建项目。 版本要求: React Native 0.74-0.85, legacy versions before 0.74。环境要求: Expo, React Native Community CLI, Android, iOS, New Architecture, Legacy Architecture。"
metadata:
  env: Expo, React Native Community CLI, Android, iOS, New Architecture, Legacy Architecture
  version: React Native 0.74-0.85, legacy versions before 0.74
name: rn-create-app
---

## Pre Requirement(必读)
当要求不符合时，禁止使用该 Skill。
- 版本要求: React Native 0.74-0.85, legacy versions before 0.74
- 环境要求: Expo, React Native Community CLI, Android, iOS, New Architecture, Legacy Architecture

## Rn Create App

## Overview

在创建 React Native 应用前，先把版本、架构、初始化路径和原生平台边界确认清楚。这个 Skill 的首要职责是阻止 Agent 在用户未确认 Expo/原生 CLI/New Architecture/Legacy Architecture 时直接执行创建命令。

## When To Invoke

- 用户要求“创建 React Native 应用”“初始化 RN 项目”“搭一个 RN App”。
- 用户需要在 Expo、React Native Community CLI、已有 Android/iOS 原生 App 集成 RN 之间做选择。
- 用户提到 RN 0.74-0.85、0.85 之前版本、新架构、旧架构、Bridgeless、TurboModule、Fabric 或原生模块。
- 用户要求同时生成 Android/iOS 工程、配置 CocoaPods/Gradle、接入原生 Android 或 iOS 模块。

## Stop Rule

如果以下信息没有被用户明确确认，停止创建，只提出最少必要问题：

1. 初始化路径：Expo managed/CNG、React Native Community CLI 新项目、还是已有 Android/iOS 原生 App 集成 RN。
2. 架构目标：New Architecture、Legacy Architecture，或“必须兼容某个旧 RN/旧原生模块”。
3. 目标版本：使用当前最新稳定版本、指定 RN 版本，还是为了兼容历史项目锁定 0.85 之前版本。
4. 平台范围：Android、iOS、双端，是否需要真机能力或只需模拟器。
5. 包管理器：RN 项目默认使用 `yarn`，除非目标模板或用户明确要求 `npm`、`pnpm` 或 Expo 默认命令。

不要用“默认 Expo”或“默认 CLI”替用户决定。用户只说“创建 RN App”时，应先问架构和初始化路径。

## Workflow

1. 收集约束并复述选择。
   - 询问并确认 Stop Rule 中缺失的信息。
   - 若用户已有仓库，先读取 `package.json`、`react-native.config.js`、`android/gradle.properties`、`android/build.gradle(.kts)`、`ios/Podfile`，不要只凭口头描述判断。
   - 如果用户指定 RN 版本或要求 0.85 之前版本，读取 `references/rn-version-architecture.md`。

2. 选择初始化路径。
   - Expo managed/CNG：适合希望用 Expo Router、EAS、OTA、config plugins 管理原生配置，且原生能力能通过 Expo SDK、development build 或自定义 native module 表达的 App。
   - React Native Community CLI：适合需要直接拥有 `android/` 和 `ios/`、深度改 Gradle/CocoaPods/Xcode、接入复杂原生 SDK、调试原生模块或不希望引入 Expo 运行时约束的 App。
   - 已有原生 App 集成 RN：适合 Android/iOS 已有宿主工程，只把 RN 作为页面或业务模块嵌入；这不是普通 `init`，需要先设计宿主集成、包管理、Bundle、导航和发布链路。

3. 选择版本和架构。
   - RN 0.85：按当前稳定版本处理；确认 Node、Jest preset、Metro 和模板变更后创建。
   - RN 0.76-0.84：新架构默认启用；如果用户要求旧架构，必须显式关闭并记录原因。
   - RN 0.74-0.75：新架构启用时 Bridgeless 默认；不要假设所有项目默认启用新架构。
   - RN < 0.74：按 Legacy Architecture 或历史模板兼容任务处理，优先问清旧原生模块、Hermes、Flipper、Gradle、CocoaPods 约束。

4. 执行创建命令。
   - Expo:
     ```bash
     npx create-expo-app@latest MyApp
     ```
     只有需要生成原生目录、接入自定义原生代码或检查原生配置时，才运行：
     ```bash
     npx expo prebuild
     ```
   - React Native Community CLI 当前稳定版本:
     ```bash
     npx @react-native-community/cli@latest init MyApp --version latest
     ```
   - React Native Community CLI 指定版本:
     ```bash
     npx @react-native-community/cli@latest init MyApp --version 0.85.0
     ```
   - 如果创建在既有 monorepo 中，先确认 workspace 包管理器和 nohoist/nodeLinker 策略，避免把错误版本的 `react-native` 或 Babel helper 提升到共享根。

5. 配置平台。
   - Android：确认 Gradle 文件后缀是 `.gradle` 还是 `.gradle.kts`；本仓库跨端规范要求新增 Android Gradle 配置优先使用 Kotlin DSL `.kts`。
   - iOS：确认 Ruby/CocoaPods 环境、`ios/Podfile`、deployment target 和 Xcode scheme。
   - Expo CNG：优先通过 `app.json`/`app.config.*` 和 config plugins 表达原生配置；不要手改生成目录后忘记把配置来源固化。

6. 验证。
   - JS 依赖安装成功，锁文件与用户确认的包管理器一致。
   - Android 至少执行一次 debug 构建或 Gradle model 检查。
   - iOS 至少执行 `pod install` 和一次 Debug 构建；如果没有 macOS/Xcode 环境，明确记录阻塞。
   - Expo 项目区分 Expo Go、development build、prebuild 后原生构建三种验收，不要把 Expo Go 启动当作自定义原生模块验收。

## Expo And Native Module Boundaries

- Expo Go 只能运行其内置原生模块；需要自定义 Android/iOS 代码时，改用 development build 或 prebuild。
- Expo CNG/prebuild 会生成原生目录，但长期维护入口应是配置插件和 Expo config；直接修改 `android/`、`ios/` 后要确认是否需要反向沉淀为 config plugin。
- Community CLI 项目天然拥有原生目录，适合直接修改 Android/iOS；代价是环境搭建、Pods、Gradle、签名和升级维护都由项目自己承担。
- Android native module 重点检查 Gradle、Kotlin/Java、package autolinking、minSdk/compileSdk、新架构 `TurboReactPackage` 或旧架构 `ReactPackage`。
- iOS native module 重点检查 CocoaPods podspec、Objective-C/Swift 暴露、module map、codegen、deployment target、新架构 generated Spec 或旧桥宏。

## Anti-Patterns

- 用户没有明确架构时直接运行 `create-expo-app` 或 `react-native init`。
- 把 Expo、Expo Go、prebuild、development build 混为同一种运行方式。
- 在 RN 0.76+ 中默认按旧桥写新模块，却没有记录 Legacy 兼容原因。
- 在 RN 0.74-0.75 中假设新架构必然默认启用。
- 在已有原生宿主项目中直接创建一个独立 RN App，然后让用户手动迁移。

## References

- `references/rn-version-architecture.md`：当涉及 RN 0.74-0.85、0.85 之前版本、Expo/CLI/native module 差异时读取。

## Good Example

用户说：“帮我创建一个 RN 0.85 的双端 App，要直接接入一个自研 Android/iOS 播放器 SDK，不用 Expo。”

正确处理：

1. 复述选择：Community CLI、RN 0.85、New Architecture 默认、Android+iOS、需要原生 SDK。
2. 确认包管理器使用 `yarn`，项目名、bundle id/package name、最低 iOS/Android 版本。
3. 执行 `npx @react-native-community/cli@latest init PlayerApp --version 0.85.0`。
4. 安装依赖后检查 `android/gradle.properties`、`ios/Podfile`、`react-native.config.js`。
5. 规划播放器 SDK 的 Android Gradle/CocoaPods 接入和 TurboModule/Fabric/native view 边界。
6. 执行 Android debug 构建、iOS `pod install` 和 Debug 构建。
