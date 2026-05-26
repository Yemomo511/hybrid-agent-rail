---
name: rn-router
description: 为 React Native 项目设计、选择或迁移导航方案时使用。适用于 Expo Router、React Navigation、Stack/Tab/Drawer、deep link、typed routes、web routing、导航迁移、Expo SDK 52-56 或 React Navigation 5/6/7 使用差异判断；缺少项目类型、导航版本、平台和路由约束时必须先读取项目事实再决策。
---

## Rn Router

## Overview

为 React Native 导航选型和落地提供判断流程。先确认项目事实，再决定使用 Expo Router 的文件路由，还是 React Navigation 的代码化导航树。

## When To Invoke

- 用户要求在 RN 项目中新增、重构或迁移导航。
- 用户提到 Expo Router、React Navigation、`NavigationContainer`、`Stack`、`Tabs`、`Drawer`、deep link、typed routes 或 web routing。
- 用户需要判断新旧 Expo SDK、Expo Router、React Navigation 版本的不同写法。
- 用户需要从 React Navigation 迁移到 Expo Router，或从 Expo Router 退回 React Navigation。

## Stop Rule

缺少以下信息时，先读取项目根目录 `.hyar/ARCH_CONTEXT.md`；已有同一前置项答案时直接复用。仍缺信息时先问，不要改导航结构：

1. 平台范围：Android、iOS、Web，是否要求 universal links、browser history、SSR/SSG 或只做移动端。
2. 导航约束：是否已有复杂 React Navigation 状态、custom navigator、custom linking parser、独立 `NavigationContainer`、原生宿主导航或埋点依赖。
3. 变更目标：新建导航、加页面、迁移旧栈、修复 deep link，还是补类型和测试。

## Pre-Question Best Practice

每个前置问题都必须提供“最佳实践”选项：

- 平台范围：默认 Android + iOS；只有需求明确包含 Web、SEO 或分享链接时纳入 Web routing。
- 导航约束：默认保持最小导航栈；只有收益明确且迁移成本可控时迁移。
- 变更目标：默认最小改动满足当前路由需求，再考虑整体迁移。

用户回答任一前置问题后，使用 `arch-context-collect` 记录问题描述、前置项名称、用户回答、适用 Skill 和更新时间。

## Workflow

1. 获取项目事实: 导航入口、Android/iOS linking 配置。
2. 需要选型时读取 `references/router-selection.md`：
   - 新 Expo 项目、Universal App、强 deep link/web/typed routes 需求：优先 Expo Router。
   - Community CLI、既有复杂 React Navigation、原生宿主导航、custom state/linking/parser：优先 React Navigation。
3. 使用 Expo Router 时读取 `references/expo-router.md`，按文件系统、layout、navigation primitives、Stack/Tabs/Drawer 组织路由。
4. 使用 React Navigation 时读取 `references/react-navigation.md`，按 static/dynamic API 选择 Stack/Native Stack/Tabs/Drawer/Nesting。
5. 涉及历史版本、升级或迁移时读取 `references/version-migration.md`，特别注意 Expo SDK 56 的 Expo Router import 路径和 React Navigation 7 static config。
6. 需要最佳实践落点时读取 `references/best-practices.md`，选择最接近的 App 场景后再改代码。
7. 验收：启动 Metro；移动端至少跑通一个主要路由跳转；涉及 deep link 时验证 scheme/universal link；涉及 Web 时验证 URL、刷新和回退；涉及迁移时保留关键页面、参数和埋点语义。

## Reference Routing

- `references/router-selection.md`：判断 Expo Router 或 React Navigation，以及不适用场景。
- `references/expo-router.md`：实现 Expo Router 文件系统、layout、navigation、Stack/Tabs/Drawer 和 SDK 56 写法。
- `references/react-navigation.md`：实现 React Navigation 7 static config、旧 dynamic API、Stack/Native Stack/Tabs/Drawer/Nesting 和平台配置。
- `references/version-migration.md`：处理 Expo SDK 52-56、Expo Router v3+、React Navigation 5/6/7 迁移差异。
- `references/best-practices.md`：按 App 类型选择常见导航结构和验收重点。

## Anti-Patterns

- 没读项目版本就照抄最新 Expo Router 或 React Navigation 文档。
- 在非 Expo CLI 项目中强行引入 Expo Router，却没有先确认 Expo CLI/Metro 集成。
- 把 Expo Router 与 React Navigation 当成完全无关的两套体系；Expo Router 的导航能力建立在 React Navigation 之上。
- 在已有复杂 React Navigation 项目中，为了“新”而一次性全量迁移文件路由。
- 在 Expo Router 中手写全局 `NavigationContainer`，或在 React Navigation 中跳过 linking 配置却声称 deep link 已完成。
