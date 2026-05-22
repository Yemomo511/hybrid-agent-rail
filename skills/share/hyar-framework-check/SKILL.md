---
name: hyar-framework-check
description: 选择跨端框架前使用。适用于用户要求在 KMP、React Native、Flutter、uni-app 之间做技术选型、比较跨端框架、判断小程序/App/Web/桌面/鸿蒙/存量原生 App 适合方案，或需要根据团队技术栈、UI 策略、原生能力和交付约束推荐框架时；信息不足时必须先询问，禁止直接推荐。
---

## Hyar Framework Check

## Overview

基于用户需求，选择合适的跨端框架，并向用户提出问题。OK

## When To Invoke

- 想知道哪个跨端框架更好
- 创建跨端 App 时
- 团队需要跨端技术选型

## Selection Gate

你需要知晓一下内容考虑做出推荐，停止推荐，只提出最少必要问题，每次对话只问 1 个问题。用户确认回答后再接着询问。

1. 用户画像：完全小白、普通开发者但不懂跨端、稍微了解跨端、了解某一跨端框架。
2. 目标平台：Android、iOS、Web、小程序、windows、macOS、鸿蒙；App、SDK。
3. 常用语言: 主要弄清用户会更加接受 TS, React 生态，Android/iOS 原生生态。偏好哪种语言 Typescript, Kotlin, Dart, 原生语言等等。
4. UI DSL: 喜欢哪种 DSL，向用户展示 ComposeUI 的 `builder`形式的 UI描述还是 React 组件描述，以及其它的UI描述。
5. 原生能力：主要关注用户的需求是否需要原生系统能力，还是简单的业务需求。
6. 交付约束：上线周期、招聘维护、生态成熟度、长期演进性。

禁止在门禁未满足时输出“推荐 Flutter/RN/KMP/uni-app”。允许输出“我还不能推荐，需要先确认 X”。

## Question Flow

每轮只问一个会影响结论的最高优先级问题。不要把用户画像、目标平台、团队栈、原生能力、UI 策略和交付约束打包成一组问题。

1. 先判定用户画像。

2. 确认目标平台和产品形态。

3. 确认用户的技术偏好。对于纯小白，列出各个技术的曲线难度。

4. 最后输出推荐。
   - 输出必须包含：首选方案、备选方案、不推荐方案、取舍理由、需要二次确认的问题。

## Question Template

```markdown
### 待确认问题

当前我还不能直接推荐框架，因为缺少：缺失信息名称。

问题：一次只问一个具体问题。

可选回答：
1. 选项 A：适用含义
2. 选项 B：适用含义
3. 选项 C：适用含义

我的推荐：如果可以根据上下文推断，给出推荐选项；否则写“需要你选择”。
```

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
2. 先问：“你更像哪类使用者：完全小白、会开发但不懂跨端、稍微了解跨端、还是已经熟悉某个框架？”
3. 用户回答后，每轮只继续追问一个缺失信息，例如目标平台、团队技术栈、原生能力或 UI 策略。
4. 信息齐全后，再按输出模板给出首选、备选、不推荐和二次确认问题。
