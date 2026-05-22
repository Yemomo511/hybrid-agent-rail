## Hybrid Skills
Hybrid Skills 作为原子化功能，为Agent 提供完成跨端需求的原子能力。目前大致有以下基类,如果你在实践过程中发现一类通用型的Skill，欢迎告知我。
- Workflow Skill: 作为Agent 的工作方法论存在，如帮我提出计划，帮我Review 计划等，属于方法论范畴
- Hybrid Info Skill: 跨端专业 Skill， 主要包括如何创建/完成需求/测试/部署一个跨端 App 应用。

### Hybrid Info Skill
为了统一管理，我们将所有的Hybrid 需要补足的信息分为以下部分。

- `skills/react-native/`：React Native 专属 Skill，例如 `rn-create-app` 负责在创建 RN 应用前确认 Expo / Community CLI / 既有原生 App 集成路径、New Architecture / Legacy Architecture、RN 版本和 Android/iOS 平台范围。用户架构不明确时必须先询问，不能直接创建项目。
- `skills/share/`：跨端通用知识、通用流程或不绑定单个跨端框架的 Skill。
- `skills/<language>/`：语言专属 Skill，例如 `dart`、`kotlin`、`swift`、`java`。
- `skills/<framework>/`：新增单独框架时建立对应框架目录；不要把普通 Skill 直接放在 `skills/` 根目录。
- `skills/flutter/`：当前用于 Flutter 官方 curated Skill，由 `create-curated-skill` 维护，不用 `create-skill` 写入普通 repo-local Skill。
