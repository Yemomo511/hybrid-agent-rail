---
name: rn-test
description: 为 React Native 项目设计、补充或修复测试时使用。适用于静态分析、Jest 单元测试、mock、集成测试、React Native Testing Library 组件测试、快照测试、Detox/Appium/Maestro E2E 测试、测试工具缺失处理、测试命令和验收链路梳理等场景；缺少 RN 版本、测试目标、平台范围或本地/CI 验收要求时必须先询问。
---

## Rn Test

## Overview

为 React Native 项目补测试前，先读取项目事实，再选择最小足够的测试层级。优先用快速 JS 测试覆盖逻辑和组件行为，只用 E2E 覆盖关键用户路径。

## When To Invoke

- 用户要求为 RN 项目新增、修复、迁移或设计测试。
- 用户提到 Jest、React Native Testing Library、snapshot、Detox、Appium、Maestro、lint、typecheck、mock 或 E2E。
- 用户需要判断某个 RN 功能应使用单元、集成、组件还是设备测试验收。

## Stop Rule

缺少以下信息时先读取项目根目录 `.hyar/ARCH_CONTEXT.md`；已有同一前置项答案时直接复用。仍缺信息时先问，不要直接改测试配置或引入工具：

1. RN 版本：至少能判断是否是 RN `0.85+`，因为 Jest preset 已迁移到 `@react-native/jest-preset`。
2. 测试目标：静态分析、单元、mock、集成、组件、快照、E2E，或为某个 bug 补回归测试。
3. 平台范围：Android、iOS、双端，是否需要真机、模拟器、CI 或只跑 Node.js 测试。
4. 包管理器和脚本：RN 项目默认优先尊重现有 `yarn`；若项目已使用 `pnpm`、`npm` 或 Expo 默认命令，则跟随项目事实。
5. 验收要求：本地命令、CI 命令、设备验收、覆盖率或只需新增可执行测试。

## Pre-Question Best Practice

每个前置问题都必须提供“最佳实践”选项。默认值按最小化、最新技术、通用技术排序：

- RN 版本：默认读取 `package.json` 的实际版本；新项目按最新稳定 RN 的 Jest 约定处理。
- 测试目标：默认先补最小相关 JS 单元/组件回归测试，只有关键端到端路径再扩展 E2E。
- 平台范围：默认先跑 Node.js/Jest 层验证；涉及原生行为时再扩展 Android/iOS 构建或设备验收。
- 包管理器和脚本：默认尊重现有 lockfile 和 scripts；无项目事实时 RN 默认 `yarn`。
- 验收要求：默认运行最小相关命令，再按风险扩大到全量测试、平台构建或 CI 命令。

用户回答任一前置问题后，使用 `arch-context-collect` 记录问题描述、前置项名称、用户回答、适用 Skill 和更新时间。

## Workflow

1. 读取当前项目事实：
   - `package.json` scripts、dependencies、devDependencies、package manager 字段或 lockfile。
   - `jest.config.*`、`babel.config.*`、`tsconfig.json`、ESLint 配置。
   - `__tests__/`、`*.test.*`、`*.spec.*`、`jest.setup.*`、`e2e/`。
   - Detox/Appium/Maestro 配置，Android Gradle 和 iOS Podfile/scheme。
2. 判断测试层级：
   - 测试方案选择先读 `references/testing-overview.md`。
   - 静态分析、单元测试、mock 先读 `references/static-unit-mock.md`。
   - 集成、组件、快照先读 `references/integration-component-snapshot.md`。
   - 真机/模拟器流程和 E2E 先读 `references/e2e.md`。
3. 工具缺失时先复用现有栈；确实没有再补依赖和配置，并说明原因。
4. 编码时按用户视角写断言：业务逻辑测输入输出，组件测可见文本/accessibility/交互结果，E2E 测屏幕上的用户路径。
5. 验收时先跑最小相关命令，再按风险扩大到全量测试、平台构建或设备验证。

## Reference Routing

- `references/testing-overview.md`：需要决定测试类型、覆盖范围、命令和测试金字塔时读取。
- `references/static-unit-mock.md`：写 lint/typecheck/Jest 单元测试、mock Native Module、网络、时间和存储时读取。
- `references/integration-component-snapshot.md`：写 RNTL 组件交互、跨模块集成或快照测试时读取。
- `references/e2e.md`：写 Detox/Appium/Maestro E2E、设备验收、模拟器阻塞记录时读取。

## Anti-Patterns

- 没有读取项目版本和现有测试配置就照搬最新模板。
- 把所有逻辑塞进组件后只写 E2E，导致反馈慢且不稳定。
- 组件测试断言内部 state、props 或私有函数，而不是用户能看到或操作的结果。
- 为大页面生成巨大 snapshot，然后失败时无审查地更新快照。
- 设备没有跑通时声称 E2E 已完成；应记录阻塞、日志和下一条可执行命令。
