---
name: hybrid-written-plan-skill
description: 说明 hybrid-written-plan Skill 如何补充上游 writing-plans 的跨端原生与桥接决策。
keywords: 跨端计划, 原生修改判断, 桥接形式选择, writing-plans补充, hybrid-written-plan
doc_type: contract
source_path: skills/hybrid-written-plan/SKILL.md
---
# Hybrid Written Plan Skill

## Purpose
说明跨端需求计划阶段必须补充哪些原生影响和桥接形式判断，避免实现计划遗漏 Android/iOS、桥接契约或验证路径。

## Applies To
- 当需求计划使用上游 `superpowers:writing-plans`，且需求涉及跨端 App、跨端 SDK、React Native、Flutter、Lynx 或原生桥接时。
- 当需求可能触及 Android/iOS 原生代码、生成桥接契约、native module、native view、事件流、回调或平台构建配置时。

## Content
`skills/hybrid-written-plan/SKILL.md` 是计划阶段的补充 Skill，不替代上游 `superpowers:writing-plans`。使用时应保留上游计划的任务粒度、TDD、路径、命令和交付结构，并在任务拆分前补充 `Hybrid Native Impact` 判断。

该 Skill 要求计划明确回答：

1. 跨端需求是否涉及原生修改，还是仅 JS/Dart、生成契约或文档层变化。
2. 涉及 Android、iOS 还是双端。
3. 是否复用、扩展或替换已有桥接契约。
4. 使用何种桥形式，例如 React Native old bridge、TurboModule、Fabric/native component、Flutter MethodChannel、EventChannel、PlatformView、生成桥接或 native-only 路径。
5. 用哪些原生构建、运行时、设备或模拟器检查证明计划可验收。

如果这些问题无法从需求或仓库事实中确认，计划应把它们列为显式开放问题，而不是默认自行判断。

## Update When
- `skills/hybrid-written-plan/SKILL.md` 的触发范围、桥接决策规则或计划输出要求变化。
- 仓库新增跨端框架、桥接形式、生成契约来源或验证门禁。
- 上游 `superpowers:writing-plans` 的计划结构发生变化，需要调整补充 Skill 的组合方式。
