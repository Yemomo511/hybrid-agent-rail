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

在创建 React Native 应用前，先确认初始化路径、架构、版本和平台边界；信息不全时不要直接执行创建命令。

## When To Invoke

- 用户要求“创建 React Native 应用”“初始化 RN 项目”“搭一个 RN App”。
- 用户需要在 Expo、React Native Community CLI、已有 Android/iOS 原生 App 集成 RN 之间做选择。
- 用户提到 RN 版本、新架构、旧架构、Bridgeless、TurboModule、Fabric 或原生模块。

## Stop Rule

缺少以下信息时先问，不要创建：

1. 初始化路径：Expo managed/CNG、React Native Community CLI 新项目、还是已有 Android/iOS 原生 App 集成 RN。
2. 架构目标：New Architecture、Legacy Architecture，或“必须兼容某个旧 RN/旧原生模块”。
3. 目标版本：最新稳定版、指定版本，还是历史兼容版本。
4. 平台范围：Android、iOS、双端，是否需要真机能力或只需模拟器。
5. 包管理器：RN 项目默认使用 `yarn`，除非目标模板或用户明确要求 `npm`、`pnpm` 或 Expo 默认命令。

## Workflow

1. 读取现有项目事实：`package.json`、`react-native.config.js`、`android/gradle.properties`、Gradle 文件、`ios/Podfile`。
2. 需要版本判断时读取 `references/rn-version-architecture.md`。
3. 路径选择：
   - Expo managed/CNG：适合 Expo SDK、config plugins、development build 能覆盖的 App。
   - Community CLI：适合直接维护 `android/`、`ios/`、Gradle、CocoaPods、原生 SDK 的 App。
   - 既有原生 App 集成 RN：先设计宿主集成、Bundle、导航和发布链路，不走普通 `init`。
4. 版本策略：
   - RN `0.76+` 新项目默认按 New Architecture 处理；旧架构必须有明确兼容原因。
   - RN `0.74-0.75` 先确认 `newArchEnabled`。
   - RN `<0.74` 默认按历史/Legacy 兼容任务处理。
5. 创建命令：
   - Expo: `npx create-expo-app@latest MyApp`
   - Expo prebuild: `npx expo prebuild`
   - Community CLI: `npx @react-native-community/cli@latest init MyApp --version latest`
   - 指定版本: `npx @react-native-community/cli@latest init MyApp --version 0.85.0`
6. 验收：依赖安装成功；Android debug 构建或 Gradle model 检查通过；iOS `pod install` 和 Debug 构建通过；自定义原生能力不能只用 Expo Go 验收。

## Anti-Patterns

- 用户没有明确架构时直接运行 `create-expo-app` 或 `react-native init`。
- 把 Expo、Expo Go、prebuild、development build 混为同一种运行方式。
- 在 RN 0.76+ 中默认按旧桥写新模块，却没有记录 Legacy 兼容原因。
- 在 RN 0.74-0.75 中假设新架构必然默认启用。
- 在已有原生宿主项目中直接创建一个独立 RN App，然后让用户手动迁移。

## References

- `references/rn-version-architecture.md`：当涉及 RN 0.74-0.85、0.85 之前版本、Expo/CLI/native module 差异时读取。
