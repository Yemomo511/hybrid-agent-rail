## Hybrid Skills
Hybrid Skills 作为原子化功能，为Agent 提供完成跨端需求的原子能力。目前大致有以下基类,如果你在实践过程中发现一类通用型的Skill，欢迎告知我。
- Workflow Skill: 作为Agent 的工作方法论存在，如帮我提出计划，帮我Review 计划等，属于方法论范畴
- Hybrid Info Skill: 跨端专业 Skill， 主要包括如何创建/完成需求/测试/部署一个跨端 App 应用。

### Hybrid Info Skill
为了统一管理，我们将所有的Hybrid 需要补足的信息分为以下部分。

- React Native App 创建类 Skill：负责在创建 RN 应用前确认 Expo / Community CLI / 既有原生 App 集成路径、New Architecture / Legacy Architecture、RN 版本和 Android/iOS 平台范围。用户架构不明确时必须先询问，不能直接创建项目。
