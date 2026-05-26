## Hybrid Skills
Hybrid Skills 作为原子化功能，为Agent 提供完成跨端需求的原子能力。目前大致有以下基类,如果你在实践过程中发现一类通用型的Skill，欢迎告知我。
- Workflow Skill: 作为Agent 的工作方法论存在，如帮我提出计划，帮我Review 计划等，属于方法论范畴
- Hybrid Info Skill: 跨端专业 Skill， 主要包括如何创建/完成需求/测试/部署一个跨端 App 应用。
### 核心原则
创建/修改 Skill 时，**以下原则务必遵守**:
- 框架的场景 Skill 需要有通用性，需要为该框架考虑各个版本的差异和对应的最佳使用姿势。创建 Skill 时，如用户为告诉此项，请停止让用户提供不同的资料然后进行分析，落地到创建的 Skill 中。
- 普通 Skill 需要收集前置信息时，提问前务必读取项目根目录 `.hyar/ARCH_CONTEXT.md`；已有同一前置项答案时直接复用，不重复询问。
- 普通 Skill 必须在每个前置问题中提供一个“最佳实践”选项，且该选项要给出可执行默认值。默认值遵循：最小化 > 最大化；最新技术 > 老技术；通用技术 > 小范围技术。
- 用户回答任一 Skill 前置问题后，使用 `arch-context-collect` 将问题描述、前置项名称、用户回答、适用 Skill 和更新时间写入 `.hyar/ARCH_CONTEXT.md`；同一个前置项的问题描述只存储一份。

### Hybrid Info Skill
为了统一管理，我们将所有的Hybrid 需要补足的信息分为以下部分。

- `skills/react-native/`：React Native 专属 Skill，例如 `rn-create-app` 负责在创建 RN 应用前确认 Expo / Community CLI / 既有原生 App 集成路径、New Architecture / Legacy Architecture、RN 版本和 Android/iOS 平台范围；`rn-router` 负责在 RN 导航需求中判断 Expo Router / React Navigation 选型、核心概念、deep link/Web/typed routes 和新老版本迁移姿势；`rn-newarch-modules-create` 负责在 RN New Architecture 下按版本选择 TurboModule 创建方式，并覆盖 Android、iOS、C++ 三条实现路径；Expo 官方 curated Skills 负责补足 Expo App 设计、EAS、API routes、development client、Expo Modules、升级、部署和数据请求等官方工作流；`rn-test` 负责按项目事实选择静态分析、Jest 单元/mock、集成、组件、快照和 E2E 测试方案，并指导工具缺失时的补齐与验收；`rn-compo-style` 负责指导 RN 组件样式组织，优先使用 `StyleSheet.create` 和样式名引用，处理样式数组、动态样式和平台差异。用户架构、RN 版本、平台范围、导航约束、测试目标或组件样式边界不明确时必须先询问，不能直接创建项目、模块、导航结构、测试配置或大规模样式重构。
- `skills/share/`：跨端通用知识、通用流程或不绑定单个跨端框架的 Skill。
- `skills/<language>/`：语言专属 Skill，例如 `dart`、`kotlin`、`swift`、`java`。
- `skills/<framework>/`：新增单独框架时建立对应框架目录；不要把普通 Skill 直接放在 `skills/` 根目录。
- `skills/flutter/`：当前用于 Flutter 官方 curated Skill，由 `create-curated-skill` 维护，不用 `create-skill` 写入普通 repo-local Skill。
