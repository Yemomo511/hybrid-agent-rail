## Hybrid Skills
Hybrid Skills 作为原子化功能，为Agent 提供完成跨端需求的原子能力。目前大致有以下基类,如果你在实践过程中发现一类通用型的Skill，欢迎告知我。
- Workflow Skill: 作为Agent 的工作方法论存在，如帮我提出计划，帮我Review 计划等，属于方法论范畴
- Hybrid Info Skill: 跨端专业 Skill， 主要包括如何创建/完成需求/测试/部署一个跨端 App 应用。
### 核心原则
创建/修改 Skill 时，**以下原则务必遵守**:

- 框架的场景 Skill 需要有通用性，需要为该框架考虑各个版本的差异和对应的最佳使用姿势。创建 Skill 时，如用户未告诉此项，请停止让用户提供不同的资料然后进行分析，落地到创建的 Skill 中。
- 不是所有的 Skill 都需要携带 `Stop Rule` 这种 Skill 门禁。Skill 的门禁使用需要保持"严格克制"，禁止随意使用。只有当Skill 严格依赖环境时才能携带。
- 设计`Stop Rule`这种门禁时，除了初始化相关 Skill 以外。请假设已经完成了一个基本的跨端项目，跨端的一些基本前置知识不需要考虑，如RN 版本，平台范围等。
- 经验/理念 > 技术/细节实现。不要在 Skill 中描述**常规技术**的细节，如查看 xxx 文件获取 xxx 信息，只需要简洁的说明即可。
``` markdown
##Good Example
1. 查看项目已有导航栈
2. 使用Stack 路由添加新页面

##Bad Example
1. 在项目的 App.tsx 中查看 Stack Router， 获取项目已有的导航栈
2. 使用 Stack.Screen 添加新的页面，需要在 `Stack.Navigator` 中定义新的路由。路由应该包含名称和地址
``` 
> 什么是常规技术? 
> 一个软件工程程序员包含的基本素养，如查看项目事实环境，完成项目功能，分析异常错误，查看日志等。

### Hybrid Info Skill
为了统一管理，我们将所有的Hybrid 需要补足的信息分为以下部分。

- `skills/react-native/`：React Native 专属 Skill，例如 `rn-create-app` 负责在创建 RN 应用前确认 Expo / Community CLI / 既有原生 App 集成路径、New Architecture / Legacy Architecture、RN 版本和 Android/iOS 平台范围；`rn-router` 负责在 RN 导航需求中判断 Expo Router / React Navigation 选型、核心概念、deep link/Web/typed routes 和新老版本迁移姿势；`rn-newarch-modules-create` 负责在 RN New Architecture 下按版本选择 TurboModule 创建方式，并覆盖 Android、iOS、C++ 三条实现路径；Expo 官方 curated Skills 负责补足 Expo App 设计、EAS、API routes、development client、Expo Modules、升级、部署和数据请求等官方工作流；`rn-test` 负责按项目事实选择静态分析、Jest 单元/mock、集成、组件、快照和 E2E 测试方案，并指导工具缺失时的补齐与验收；`rn-compo-style` 负责指导 RN 组件样式组织，优先使用 `StyleSheet.create` 和样式名引用，处理样式数组、动态样式和平台差异。用户架构、RN 版本、平台范围、导航约束、测试目标或组件样式边界不明确时必须先询问，不能直接创建项目、模块、导航结构、测试配置或大规模样式重构。
- `skills/share/`：跨端通用知识、通用流程或不绑定单个跨端框架的 Skill。
- `skills/<language>/`：语言专属 Skill，例如 `dart`、`kotlin`、`swift`、`java`。
- `skills/<framework>/`：新增单独框架时建立对应框架目录；不要把普通 Skill 直接放在 `skills/` 根目录。
- `skills/flutter/`：当前用于 Flutter 官方 curated Skill，由 `create-curated-skill` 维护，不用 `create-skill` 写入普通 repo-local Skill。
