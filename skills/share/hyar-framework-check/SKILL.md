---
name: hyar-framework-check
description: 选择跨端框架前使用。适用于用户要求在 KMP、React Native、Flutter、uni-app 之间做技术选型、比较跨端框架、判断小程序/App/Web/桌面/鸿蒙/存量原生 App 适合方案，或需要根据团队技术栈、UI 策略、原生能力和交付约束推荐框架时；信息不足时必须先询问，禁止直接推荐。
metadata:
    version: KMP official docs current, React Native 0.85 docs, Flutter 3.44 docs, uni-app official docs 2025-2026
    env: Kotlin Multiplatform, React Native, Flutter, uni-app, Android, iOS, Web, Mini Program, Desktop, HarmonyOS
---

## Hyar Framework Check

## Overview

在推荐 KMP、React Native、Flutter、uni-app 前，先确认用户画像、目标平台、团队技术栈、UI/原生能力诉求和交付约束。这个 Skill 的首要职责是阻止 Agent 在关键信息缺失时凭印象选框架。

## When To Invoke

- 用户说“帮我选跨端框架”“KMP/RN/Flutter/uni-app 哪个好”“跨端技术选型”。
- 用户要同时覆盖 Android、iOS、Web、小程序、桌面、鸿蒙、既有原生 App 或 SDK/模块化接入。
- 用户需要从团队技术栈、原生能力、UI 一致性、性能、生态、招聘维护或交付周期角度做框架取舍。
- 用户只描述业务目标但没有明确选型，例如“做一个双端 App”“做 App+小程序”“把原生 App 跨端化”。

## Selection Gate

如果以下信息没有被用户明确确认，停止推荐，只提出最少必要问题。每次最多问 1-3 个问题；用户是小白或说“不懂”时，改用通俗选项，但不能跳过门禁。

1. 用户画像：完全小白、普通开发者但不懂跨端、稍微了解跨端、了解某一跨端框架。
2. 目标平台：Android、iOS、Web、小程序、桌面、鸿蒙、存量原生 App、SDK/模块化接入。
3. 团队技术栈：Kotlin/Android、Swift/iOS、React/JS、Vue、小程序、Dart/Flutter，或没有固定栈。
4. 原生能力：是否需要重原生 SDK、性能敏感页面、平台专有 API、离线包、已有宿主工程。
5. UI 策略：原生体验优先、统一视觉优先、接受 WebView/小程序式 runtime、局部共享优先。
6. 交付约束：上线周期、招聘维护、生态成熟度、长期演进性。

禁止在门禁未满足时输出“推荐 Flutter/RN/KMP/uni-app”。允许输出“我还不能推荐，需要先确认 X”。

## Question Flow

1. 先判定用户画像。
   - 完全小白：用产品语言提问，例如“主要想发 App、网页，还是小程序？”
   - 普通开发者：解释每个问题影响的取舍。
   - 稍懂跨端：直接询问平台、团队栈、原生能力和 UI 策略。
   - 熟悉某框架：确认是否是偏好、历史包袱，还是团队硬约束。

2. 再确认目标平台和产品形态。
   - App 双端优先、App+Web、小程序优先、全端分发、桌面、鸿蒙、存量原生 App 内嵌，是不同选型问题。
   - 如果包含小程序或鸿蒙，必须确认它们是一等目标还是“最好支持”。

3. 继续确认团队和工程约束。
   - Kotlin/Android 与原生团队强时，重点对比 KMP 与 Flutter/RN。
   - React/JS 团队强时，重点对比 React Native 与 uni-app/Flutter。
   - Vue/小程序团队强时，重点对比 uni-app 与 Flutter/RN。
   - 没有成熟团队时，把招聘、学习曲线和长期维护列为风险。

4. 最后输出推荐。
   - 输出必须包含：首选方案、备选方案、不推荐方案、取舍理由、需要二次确认的问题。
   - 如果需求冲突，不要强行单选；先指出冲突，再给 1-3 个可落地方案。

## Decision Rules

- KMP：适合希望渐进式共享业务逻辑、保留原生 UI 或原生团队优势、已有 Android/Kotlin 资产、需要直接访问平台 API 的场景。若要求小程序作为一等目标，不把 KMP 作为首选。
- React Native：适合 React/JavaScript 团队、App 双端、需要接近原生组件和原生扩展、希望复用 React 心智的场景。若核心目标是小程序全端分发，不把 RN 作为首选。
- Flutter：适合希望单代码库覆盖多平台、统一视觉、强 UI 控制、可接受 Dart 技术栈和 Flutter 渲染体系的场景。若团队强依赖原生 UI 完全平台化或要极低成本小程序覆盖，谨慎推荐。
- uni-app：适合 Vue/前端/小程序团队、Web+多家小程序+App/鸿蒙分发、快速交付和生态插件诉求强的场景。若核心诉求是极致原生体验、复杂高性能自绘或重原生 SDK，必须提示 runtime/原生扩展成本。

详细依据按需读取：

- `references/kmp.md`
- `references/react-native.md`
- `references/flutter.md`
- `references/uniapp.md`
- `references/decision-matrix.md`

## Output Format

```markdown
## 选型结论

- 首选方案：框架名称 + 一句话理由
- 备选方案：框架名称 + 适用条件
- 不推荐方案：框架名称 + 不适合原因

## 取舍理由

- 用户画像：已确认信息
- 目标平台：已确认信息
- 团队技术栈：已确认信息
- 原生能力：已确认信息
- UI 策略：已确认信息
- 交付约束：已确认信息

## 需要二次确认的问题

1. 仍会改变结论的问题
```

## References

- `references/kmp.md`：KMP 官方理念、适用场景和边界。
- `references/react-native.md`：React Native 官方理念、适用场景和边界。
- `references/flutter.md`：Flutter 官方理念、适用场景和边界。
- `references/uniapp.md`：uni-app 官方理念、适用场景和边界。
- `references/decision-matrix.md`：四个框架的选择矩阵。

## Good Example

用户说：“帮我选跨端框架。”

正确处理：

1. 不直接推荐框架。
2. 先问：“你更像哪类使用者：完全小白、会开发但不懂跨端、稍微了解跨端、还是已经熟悉某个框架？这个项目主要要发 App、Web、小程序，还是都要？”
3. 用户回答后继续补齐团队技术栈、原生能力、UI 策略。
4. 信息齐全后，再按输出模板给出首选、备选、不推荐和二次确认问题。
