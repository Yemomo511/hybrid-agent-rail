# pnpm 项目初始化任务计划

## 总目标

使用 pnpm 初始化 Hybrid Agent Rail monorepo，并建立 `example -> hyar-cli -> hyar-adapter` 的本地 workspace 依赖链。

## 子任务与验收标准

### 子任务 1：建立 workspace 结构验收

- 产物：`test/workspace.test.ts`
- 验收标准：
  - 测试能检查根目录 `pnpm-workspace.yaml`
  - 测试能检查根包脚本、package 目录、example 目录
  - 测试能检查 `example` 依赖 `hyar-cli`
  - 测试能检查 `hyar-cli` 依赖 `hyar-adapter`

### 子任务 2：初始化 pnpm workspace 与包元数据

- 产物：`package.json`、`pnpm-workspace.yaml`、`tsconfig.base.json`
- 验收标准：
  - workspace 包含 `package/*` 与 `example`
  - 根脚本提供 `build`、`test`、`test:workspace`、`test:smoke`
  - 根开发依赖包含 TypeScript 与 Rollup 构建链

### 子任务 3：实现 hyar-adapter 与 hyar-cli 最小包

- 产物：`package/hyar-adapter/*`、`package/hyar-cli/*`
- 验收标准：
  - `hyar-adapter` 可构建 CJS 与 ESM 产物
  - `hyar-cli` 通过 `workspace:*` 依赖 `hyar-adapter`
  - `hyar-cli` 导出的运行时描述能包含 adapter 信息

### 子任务 4：实现 example 消费链路

- 产物：`example/package.json`、`example/src/index.mjs`
- 验收标准：
  - `example` 通过 `workspace:*` 依赖 `hyar-cli`
  - 构建后 `pnpm --filter hyar-example smoke` 能从 `hyar-cli` 读到 `hyar-adapter`

### 子任务 5：安装依赖、验证并提交

- 验收标准：
  - `pnpm install` 成功生成 lockfile
  - `pnpm test` 成功
  - `git diff --check` 成功
  - 使用中文规范提交，提交信息以 `[AI]` 开头

### 子任务 6：补齐 package 测试 API 与 example 安装验收

- 产物：`example/src/test-api.mjs`、`package/*/src/index.ts`
- 验收标准：
  - 每个 package 均通过 Rollup 输出 `dist/index.mjs`、`dist/index.cjs`、`dist/index.d.ts`
  - `hyar-adapter` 暴露 `runAdapterPackageTestApi`
  - `hyar-cli` 暴露 `runCliPackageTestApi`，并在内部调用 `hyar-adapter`
  - `example` 通过已安装的 `hyar-cli` 运行测试 API，并证明链路来自 `hyar-cli -> hyar-adapter`

### 子任务 7：接入 Jest 单元测试依赖与配置

- 产物：`package.json`、`pnpm-lock.yaml`、`jest.config.mjs`
- 验收标准：
  - 根开发依赖包含 `jest`
  - Jest 配置使用 Node 测试环境并匹配 `test/**/*.test.ts`
  - 根测试脚本不再使用 `node --test`

### 子任务 8：迁移已有单元测试到 Jest 断言风格

- 产物：`test/workspace.test.ts`、`test/package-output.test.ts`
- 验收标准：
  - 测试用例从 `node:test` 与 `node:assert/strict` 迁移到 `@jest/globals`
  - 原有 workspace、脚本、依赖链、构建产物验收语义保持不变

### 子任务 9：验证并提交 Jest 接入

- 验收标准：
  - `pnpm run test:workspace` 成功
  - `pnpm run build` 成功
  - `pnpm run test:package-output` 成功
  - `pnpm test` 成功
  - `git diff --check` 成功
  - 使用中文规范提交，提交信息为 `[AI]test: 接入 Jest 单元测试`

### 子任务 10：统一 Jest 测试文件为 TypeScript

- 产物：`test/workspace.test.ts`、`test/package-output.test.ts`、`jest.config.mjs`
- 验收标准：
  - 当前已有 Jest 测试文件均使用 `.ts` 后缀
  - Jest 配置能通过 `ts-jest` 执行 TypeScript 测试
  - 根测试脚本指向 `.test.ts` 测试文件
  - 原有 workspace、脚本、依赖链、构建产物验收语义保持不变

### 子任务 11：同步测试文档

- 产物：`test/AGENTS.md`
- 验收标准：
  - 文档说明 Jest 测试统一使用 `.test.ts`
  - 文档列出 `test:workspace`、`test:package-output` 与 `pnpm test` 的职责
  - 文档说明 `ts-jest`、ESM VM Modules、`--watchman=false` 和 Rollup package 构建输入范围约定

---

# hybrid-written-plan Skill 创建任务计划

## 总目标

创建一个 repo-local Hybrid Skill，作为上游 `superpowers:writing-plans` 的跨端补充，要求计划阶段显式判断是否涉及原生修改以及应该采用哪种桥接形式。

## 子任务与验收标准

### 子任务 1：确认 Skill 边界与位置

- 产物：`skills/hybrid-written-plan/SKILL.md`
- 验收标准：
  - Skill 位于仓库 `skills/` 目录
  - frontmatter 能触发跨端、React Native、Flutter、原生桥接计划场景
  - 内容明确其上游为 `superpowers:writing-plans`

### 子任务 2：补充跨端计划决策规则

- 产物：`skills/hybrid-written-plan/SKILL.md`
- 验收标准：
  - 计划要求包含 `Hybrid Native Impact`
  - 明确判断是否涉及 Android/iOS 原生修改
  - 明确桥接形式选择规则与验证要求
  - 提供可复用 Good Example

### 子任务 3：同步 Skill 元信息与文档系统

- 产物：`skills/hybrid-written-plan/agents/openai.yaml`、`docs/hybrid-written-plan-skill.md`、`docs/KNOWLEDGE.md`
- 验收标准：
  - `agents/openai.yaml` 与 Skill 内容一致
  - 文档系统记录该 Skill 的职责边界和更新条件
  - 文档校验通过

### 子任务 4：验证并提交

- 验收标准：
  - `quick_validate.py` 校验 Skill 通过
  - `create-doc` 文档校验通过
  - `git diff --check` 通过或明确说明既有无关问题
  - 使用中文规范提交，提交信息以 `[AI]` 开头

---

# RN 拍照页面实现计划

## 总目标

在目标 React Native App 中完成一个可拍照、可预览、可重拍、可确认返回图片结果的拍照页面，并保证 Android / iOS 权限、运行时相机能力、页面状态和构建验证闭环。

## Hybrid Native Impact

- 需求涉及 Android / iOS 原生能力：相机权限、相机预览、拍照输出、相册或临时文件访问。
- 优先复用成熟 RN 包，不从零实现原生相机桥。默认建议 `react-native-vision-camera`，因为它提供相机预览、拍照、权限 API，并支持新架构；如果目标项目 RN 版本、Hermes、minSdk 或 iOS deployment target 不满足，再降级评估 `react-native-image-picker` 或项目已有相机模块。
- 桥接形式：优先使用第三方 RN 原生模块和 native view；业务层只封装 TS Hook / Page / Result contract。只有当第三方包无法满足定制预览、扫码叠加、滤镜或压缩链路时，才新增自定义 Android/iOS 原生桥。
- 验证必须覆盖 JS 单测、Android 构建、iOS Pod 安装与构建，真机验收需要至少覆盖授权弹窗、预览可见、拍照成功、取消/重拍/确认链路。

## 模块拆分与能力组合

### 模块 1：相机依赖与项目能力探测

- 需要能力：读取目标 RN 版本、React 版本、Android minSdk、iOS deployment target、是否启用 New Architecture、包管理工具。
- 计划动作：
  - 检查 `package.json`、`android/build.gradle(.kts)`、`android/app/build.gradle(.kts)`、`ios/Podfile`。
  - 确认 `react-native-vision-camera` 当前版本与目标项目兼容。
  - 若不兼容，输出替代路径：`react-native-image-picker` 只做系统相机拉起；自定义 native view 只在强需求下使用。
- 验收标准：
  - 给出最终相机方案和版本选择。
  - 明确 Android minSdk / compileSdk、iOS deployment target 是否需要调整。
  - 明确是否需要执行 `pod install` 与 Android Gradle 同步。

### 模块 2：页面契约与导航结果

- 需要能力：定义拍照页输入参数、输出结果、失败/取消语义。
- 计划动作：
  - 新增 `CameraCaptureResult` 类型，字段包含 `uri`、`width`、`height`、`fileName?`、`mimeType?`、`timestamp`。
  - 页面入参支持 `quality?`、`enableFlash?`、`onConfirm` 或导航返回 callback。
  - 页面状态分为 `checkingPermission`、`permissionDenied`、`ready`、`capturing`、`preview`、`failed`。
- 验收标准：
  - 调用方能区分用户取消、权限拒绝、拍照失败、拍照成功。
  - 页面不会把临时文件路径和业务上传逻辑耦合在一起。

### 模块 3：权限与设备状态 Hook

- 需要能力：申请相机权限、检测相机设备、处理未授权和无设备状态。
- 计划动作：
  - 新增 `useCameraPermissionState` 封装权限读取和申请。
  - 新增 `useCameraDeviceState` 封装前后摄像头选择、设备不存在、闪光灯可用性。
  - 权限拒绝时展示可操作空态，提供重新申请或打开系统设置入口。
- 验收标准：
  - 首次进入能触发权限申请。
  - 已授权时直接进入预览。
  - 权限拒绝和设备不可用时页面有明确状态，不崩溃。

### 模块 4：拍照 UI 与交互状态

- 需要能力：相机预览、拍照按钮、取消、闪光灯切换、前后摄像头切换、加载和错误态。
- 计划动作：
  - 新增 `CameraCapturePage.tsx` 页面组件。
  - 拆分 `CameraToolbar`、`CameraShutterButton`、`CameraPermissionEmpty`、`CameraPreviewActions` 小组件。
  - 使用 `useCallback` 封装 `renderHeader`、`renderCameraPreview`、`renderFooterActions` 等渲染函数。
- 验收标准：
  - UI 首屏就是可用拍照体验，不做营销式落地页。
  - 按钮尺寸稳定，拍照中按钮禁用并显示状态。
  - 旋转、前后台切换、页面返回时相机资源释放。

### 模块 5：拍照、预览、确认链路

- 需要能力：调用 `takePhoto`、保存临时结果、预览图片、重拍、确认返回。
- 计划动作：
  - 拍照成功后进入 `preview` 状态，展示静态图片预览。
  - 重拍清理当前结果并恢复相机预览。
  - 确认时只返回 `CameraCaptureResult`，上传、压缩、业务入库交给上层流程。
- 验收标准：
  - 连续点击拍照不会产生并发拍摄。
  - 拍照失败能返回 `failed` 状态并允许重试。
  - 确认后调用方拿到可访问的本地图片 URI。

### 模块 6：测试与平台验收

- 需要能力：组件状态测试、Hook 测试、Android/iOS 构建和真机验收。
- 计划动作：
  - 单测 mock 相机模块，覆盖权限状态、拍照成功、拍照失败、重拍、确认。
  - Android 执行 `yarn android` 或 `./gradlew assembleDebug`，确认权限声明和构建通过。
  - iOS 执行 `bundle exec pod install`、`xcodebuild` 或 `yarn ios`，确认 Pod 和权限描述可用。
  - 真机或模拟器验收时记录截图和设备信息；模拟器没有真实摄像头时只验收权限与 UI 状态，拍照成功必须用真机补证。
- 验收标准：
  - JS 测试通过。
  - Android Debug 构建通过。
  - iOS Debug 构建通过。
  - 真机完成授权、预览、拍照、预览、重拍、确认链路。

### 模块 7：文档同步与提交

- 需要能力：防止文档漂移，记录相机方案选择和平台验收命令。
- 计划动作：
  - 若目标项目有文档系统，新增或更新“RN 拍照页面使用说明 / 原生能力说明”。
  - 记录相机包版本、权限配置、调用契约、验收命令。
  - 验收完成后按规范提交。
- 验收标准：
  - 文档说明调用方式、权限要求、平台限制。
  - `git diff --check` 通过。
  - 提交信息使用中文规范：`[AI]feat: 完成 RN 拍照页面`。

---

# Rollup 配置内置到 package 任务计划

## 总目标

将共享的根目录 `config/rollup.package.config.mjs` 迁移为各 package 内部配置，确保每个 package 可以从自身目录声明、维护和执行 Rollup 构建。

## 子任务与验收标准

### 子任务 1：补充结构验收测试

- 产物：`test/workspace.test.ts`
- 验收标准：
  - 测试断言根目录不再存在共享 Rollup package 配置
  - 测试断言每个 `package/*` 均存在 `rollup.config.mjs`
  - 测试断言每个 package 的 `build` 脚本使用本地配置

### 子任务 2：迁移 package Rollup 配置

- 产物：`package/hyar-adapter/rollup.config.mjs`、`package/hyar-cli/rollup.config.mjs`、`package/*/package.json`
- 验收标准：
  - 两个 package 的构建入口均为 `src/index.ts`
  - 输出仍为 `dist/index.mjs`、`dist/index.cjs`、`dist/index.d.ts`
  - workspace 内部依赖仍作为 external 保留
  - 根共享配置文件被移除

### 子任务 3：同步文档系统

- 产物：`docs/workspace-package-contract/doc.md`
- 验收标准：
  - 文档中的 Rollup 构建契约改为 package 本地配置
  - `source_path` 不再指向已删除的根 `config` 文件
  - create-doc 文档校验通过

### 子任务 4：验证并提交

- 验收标准：
  - 红灯测试先因旧结构失败
  - 迁移后 `pnpm run test:workspace` 通过
  - `pnpm run build` 通过
  - `pnpm run test:package-output` 通过
  - `git diff --check` 通过或明确说明既有无关问题
  - 使用中文规范提交，提交信息以 `[AI]` 开头

---

# create-doc 文档目录化改造任务计划

## 总目标

将 `create-doc` 的长期文档产物从 `docs/{name}.md` 迁移为 `docs/{name}/doc.md`，同步校验器、Knowledge 索引和现有受治理文档。

## 子任务与验收标准

### 子任务 1：Planning with Files Zh 初始化

- 产物：`.codex/planning/task_plan.md`、`.codex/planning/findings.md`、`.codex/planning/progress.md`
- 验收标准：
  - 三个规划文件追加本次任务记录，不覆盖已有历史。
  - 记录现状事实、子任务验收标准和执行进度。

### 子任务 2：红灯校验设计

- 产物：`.codex/skills/create-doc/__test__/create-doc-layout.test.mjs`
- 验收标准：
  - 旧扁平文档路径在新规则下必须失败。
  - `docs/KNOWLEDGE.md` 若链接旧扁平路径，Knowledge 校验必须失败。
  - 测试在旧实现上先失败，证明覆盖到行为变化。

### 子任务 3：create-doc 契约与校验器改造

- 产物：`.codex/skills/create-doc/SKILL.md`、`.codex/skills/create-doc/references/TEMPLATE.md`、`.codex/skills/create-doc/validate.mjs`、`.codex/skills/create-doc/validate-knowlegdge.mjs`
- 验收标准：
  - Skill 文案、模板和命令示例统一使用 `docs/<name>/doc.md`。
  - 文档校验器拒绝 `docs/<name>.md`，只接受 `docs/<name>/doc.md`。
  - Knowledge 校验器要求 Source 链接目标为 `<name>/doc.md`，并与传入文档路径一致。

### 子任务 4：现有文档迁移与索引同步

- 产物：`docs/*/doc.md`、`docs/KNOWLEDGE.md`
- 验收标准：
  - 8 个受治理文档全部迁移到对应目录的 `doc.md`。
  - `docs/KNOWLEDGE.md` 的 8 个 Source 链接全部更新为 `<name>/doc.md`。
  - 仓库内不再引用旧的 `docs/<name>.md` 路径。

### 子任务 5：文档系统说明同步

- 产物：`docs/AGENTS.md`、`docs/document-system-contract/doc.md`
- 验收标准：
  - `docs/AGENTS.md` 说明文档目录名跟随 frontmatter `name`，正文固定为 `doc.md`。
  - `document-system-contract` 与 `create-doc` Skill 对目录化文档形态描述一致。

### 子任务 6：验证并提交

- 验收标准：
  - 每个 `docs/*/doc.md` 均通过 `validate.mjs` 和 `validate-knowlegdge.mjs`。
  - `node .codex/skills/create-doc/validate-knowlegdge.mjs` 通过。
  - `node --test .codex/skills/create-doc/__test__/create-doc-layout.test.mjs` 通过。
  - `git diff --check` 通过。
  - 使用 `[AI]refactor: 将文档系统迁移为目录化结构` 提交。

---

# create-curated-skill metadata 元数据改造计划

## 总目标

将 curated Skill 的可选兼容信息从 frontmatter 顶层 `version`、`env` 迁移到 `metadata.version`、`metadata.env`，并同步模板、示例、校验器与文档契约。

## 子任务与验收标准

### 子任务 1：补充 metadata 校验红灯

- 产物：`.codex/skills/create-curated-skill/__test__/metadata.test.mjs`
- 验收标准：
  - 测试覆盖 `metadata.version` 与 `metadata.env` 的合法样例。
  - 测试覆盖旧版顶层 `version` / `env` 被拒绝。

### 子任务 2：更新 curated Skill 模板和示例

- 产物：`.codex/skills/create-curated-skill/references/curated-skill-template.md`、`.codex/skills/create-curated-skill/references/curated-skill-example.md`
- 验收标准：
  - 模板展示 `metadata:` 下的可选 `version`、`env`。
  - 示例使用 `metadata.version`，不再使用顶层 `version`。

### 子任务 3：改造校验器 frontmatter 解析与字段约束

- 产物：`.codex/skills/create-curated-skill/validate.mjs`
- 验收标准：
  - 校验器能解析一层缩进的 `metadata` 对象。
  - 仅允许 `metadata.version`、`metadata.env`。
  - 顶层 `version`、`env` 报错。

### 子任务 4：同步文档系统并验证

- 产物：`.codex/skills/create-curated-skill/SKILL.md`、`docs/create-curated-skill-contract/doc.md`
- 验收标准：
  - Skill 说明和文档契约均描述 metadata 元数据形态。
  - `metadata.test.mjs`、示例 validator、文档 validator、`git diff --check` 均通过。

---

# create-skill good-example TurboModule 完善计划

## 总目标

完善 `.codex/skills/create-skill/reference/good-example/SKILL.md`，让它成为符合 Skill Creator 原则的 React Native TurboModule 好例子，并严格贴合 React Native 0.79 官方 Turbo Native Modules 指导链路。

## 子任务与验收标准

### 子任务 1：读取现有 Skill 形态与官方文档

- 产物：上下文事实记录。
- 验收标准：
  - 确认 good-example 当前仍是占位模板。
  - 确认官方 RN 0.79 TurboModule 关键步骤：TS Spec、Codegen、JS 使用、Android/iOS 原生实现与注册。

### 子任务 2：重写 good-example SKILL

- 产物：`.codex/skills/create-skill/reference/good-example/SKILL.md`
- 验收标准：
  - frontmatter 使用 `metadata.version` / `metadata.env`。
  - 正文包含触发时机、工作流、关键文件、平台实现规则、验证命令和 Good Example。
  - 不保留 `<Skill Name>`、`<Custom Description>` 等模板占位符。

### 子任务 3：同步文档系统

- 产物：`docs/skill-system-contract/doc.md`
- 验收标准：
  - 文档说明 `.codex/skills/create-skill/reference/good-example` 是 create-skill 内聚的好例子资源。
  - 文档校验与 Knowledge 同步校验通过。

### 子任务 4：验证并提交

- 验收标准：
  - `python3 .codex/skills/create-skill/script/quick_validate.py .codex/skills/create-skill/reference/good-example` 通过或说明脚本为空。
  - `git diff --check` 通过。
- 使用中文规范提交，提交信息以 `[AI]` 开头。

---

# create-skill metadata 约束收紧任务计划

## 总目标

删除 `hyar-framework-check` 中不具备真实版本/环境边界的 `metadata.version/env`，并收紧 `create-skill` 规则，避免通用知识和选型类 Skill 被模板诱导写入无意义 metadata。

## 子任务与验收标准

### 子任务 1：修正既有 Skill metadata

- 产物：`skills/share/hyar-framework-check/SKILL.md`
- 验收标准：
  - frontmatter 只保留 `name` 和 `description`。
  - Skill strict 校验通过。

### 子任务 2：收紧 create-skill 模板和说明

- 产物：`.codex/skills/create-skill/SKILL.md`、`.codex/skills/create-skill/script/init_skill.py`、`skills/skill-template.md`
- 验收标准：
  - 默认模板不再生成 `metadata`。
  - 明确 `metadata.version` 只用于跨端框架版本或版本区间约束。
  - 明确 `metadata.env` 只用于项目强配置或特定环境要求。
  - 通用知识、选型指南、流程方法论明确不写 metadata。

### 子任务 3：同步文档系统

- 产物：`docs/skill-system-contract/doc.md`、`docs/KNOWLEDGE.md`
- 验收标准：
  - 文档记录普通 Skill 默认不写 metadata 的稳定契约。
  - `docs/KNOWLEDGE.md` 与文档 frontmatter 同步。

### 子任务 4：验证并提交

- 验收标准：
  - hyar-framework-check strict 校验通过。
  - create-doc 文档校验通过。
  - 生成临时 Skill 时 frontmatter 不含 metadata。
  - `git diff --check` 通过。
  - 使用中文规范提交，提交信息以 `[AI]` 开头。

---

# hyar-framework-check Skill 创建任务计划

## 总目标

创建一个跨端通用 Hybrid Info Skill，用于在推荐 KMP、React Native、Flutter、uni-app 前强制完成用户画像、目标平台、团队技术栈、原生能力、UI 策略和交付约束确认，防止 Agent 凭印象直接选型。

## 子任务与验收标准

### 子任务 1：创建 Skill 与 references 结构

- 产物：`skills/share/hyar-framework-check/SKILL.md`、`skills/share/hyar-framework-check/references/*`
- 验收标准：
  - Skill 位于 `skills/share/` 分类目录。
  - references 拆分 KMP、React Native、Flutter、uni-app 和决策矩阵。
  - `SKILL.md` 保持流程和门禁，框架细节放入 references。

### 子任务 2：写入选择门禁和输出契约

- 产物：`skills/share/hyar-framework-check/SKILL.md`
- 验收标准：
  - 未确认用户画像、目标平台、团队技术栈、原生能力和 UI 策略前，禁止直接推荐框架。
  - 每次追问最多 1-3 个问题，并覆盖小白用户的通俗提问方式。
  - 推荐输出包含首选方案、备选方案、不推荐方案、取舍理由和二次确认问题。

### 子任务 3：同步文档系统

- 产物：`docs/skill-system-contract/doc.md`、`docs/KNOWLEDGE.md`
- 验收标准：
  - 文档记录跨端框架选择门禁属于稳定 Skill 契约。
  - `docs/KNOWLEDGE.md` 与文档 frontmatter 同步。

### 子任务 4：验证并提交

- 验收标准：
  - `quick_validate.py` default 与 strict 校验通过。
  - `rg` 能命中选择门禁和场景测试关键词。
  - create-doc 文档校验通过。
  - `git diff --check` 通过。
  - 使用中文规范提交，提交信息以 `[AI]` 开头。

---

# RN TurboModule Skill 中文化计划

## 总目标

将 `.codex/skills/create-skill/reference/good-example/SKILL.md` 中的 RN TurboModule Skill 说明性内容翻译为中文，避免英文说明影响中文 Skill 示例的一致性。

## 子任务与验收标准

### 子任务 1：翻译 Skill 说明内容

- 产物：`.codex/skills/create-skill/reference/good-example/SKILL.md`
- 验收标准：
  - frontmatter description、metadata env、章节标题、流程说明、排障说明和好例子均改为中文。
  - TurboModule、Codegen、Spec、API、路径、命令和代码标识保持原样。

### 子任务 2：验证并提交

- 验收标准：
  - `quick_validate.py` 通过。
  - 文档 diff 无尾随空格。
  - 使用中文规范提交，提交信息以 `[AI]` 开头。

---

# skill-template 基础模板补充计划

## 总目标

保持 `skills/skill-template.md` 的现有基本模板形态，并参考 `.codex/skills/create-skill/script/init_skill.py` 中的 `SKILL_TEMPLATE` 补充 Skill 创建所需的结构指引、资源说明和好例子约束。

## 子任务与验收标准

### 子任务 1：补充模板正文结构

- 产物：`skills/skill-template.md`
- 验收标准：
  - 保留原有 frontmatter、`metadata.version/env`、`When To Invoke`、可选 Source/How to use 和自定义描述区域。
  - 增加 `Overview`、结构选择说明、正文填充提示、可选 Resources 和 Good Example 区域。
  - 说明内容使用中文，代码路径和目录名保持原样。

### 子任务 2：同步文档系统并验证

- 产物：`docs/skill-system-contract/doc.md`
- 验收标准：
  - 文档说明 `skills/skill-template.md` 是保留的基础 Skill 作者模板。
  - 文档校验和 `git diff --check` 通过。

---

# create-skill 生成与校验标准化实现计划

## 总目标

将 `.codex/skills/create-skill` 的生成器和校验器统一到 `skills/skill-template.md` 标准，确保生成结果是 Skill 文件夹，并且 `Upstream Skill` 只用于 Skill-to-Skill 依赖补充关系。

## 子任务与验收标准

### 子任务 1：改造生成器

- 产物：`.codex/skills/create-skill/script/init_skill.py`
- 验收标准：
  - 生成 `<output>/<skill-name>/SKILL.md`。
  - 不再生成 `agents/openai.yaml`。
  - 支持可选 `scripts/`、`references/`、`assets/`。

### 子任务 2：实现校验器

- 产物：`.codex/skills/create-skill/script/quick_validate.py`
- 验收标准：
  - 默认模式校验结构且允许模板占位符。
  - `--strict` 模式拒绝占位符。
  - 校验 frontmatter、文件夹名、资源目录和 `Upstream Skill` 语义。

### 子任务 3：同步说明和文档系统

- 产物：`.codex/skills/create-skill/SKILL.md`、`skills/skill-template.md`、`docs/skill-system-contract/doc.md`
- 验收标准：
  - 说明 `Upstream Skill` 不是文档/API/模块来源。
  - 说明默认校验与 strict 校验使用时机。
  - 文档系统校验通过。

---

# create-skill curated Skill 防误改计划

## 总目标

补充 `create-skill` 的 curated Skill 防误改约束，确保它不能创建、修改或校验 `skills/flutter/*` 这类严格 curated Skill。

## 子任务与验收标准

### 子任务 1：增加脚本防护

- 产物：`.codex/skills/create-skill/script/init_skill.py`、`.codex/skills/create-skill/script/quick_validate.py`
- 验收标准：
  - `init_skill.py --path skills/flutter` 失败，并提示使用 `create-curated-skill`。
  - `quick_validate.py skills/flutter/<name>` 失败。
  - `quick_validate.py` 检测到 `> Curated from ...` 失败。

### 子任务 2：同步说明与文档系统

- 产物：`.codex/skills/create-skill/SKILL.md`、`docs/skill-system-contract/doc.md`
- 验收标准：
  - 明确 curated Skill 通常包含 `> Curated from ...`。
  - 明确 `create-skill` 不得修改 curated Skill。

---

# rn-create-app Skill 创建与分类迁移任务计划

## 总目标

创建一个 repo-local Hybrid Info Skill，用于在 React Native App 初始化前强制完成架构确认、版本分层、Expo 与原生 CLI 路径选择，并在信息不明确时禁止直接创建项目；同时把普通 repo-local Skill 迁移为 `skills/<category>/<skill-name>` 分类目录规则。

## 子任务与验收标准

### 子任务 1：确认官方版本事实与 Skill 边界

- 产物：`skills/react-native/rn-create-app/SKILL.md`、`skills/react-native/rn-create-app/references/rn-version-architecture.md`
- 验收标准：
  - 记录 RN 0.74、0.76、0.85 的关键架构变化。
  - 明确 0.85 之前版本与 0.85 当前稳定版本的差异。
  - 明确 Expo、React Native Community CLI、已有原生 App 集成三条初始化路径边界。

### 子任务 2：创建 Skill 主工作流

- 产物：`skills/react-native/rn-create-app/SKILL.md`
- 验收标准：
  - frontmatter 能触发创建 RN App、选择 Expo/CLI、判断新旧架构、初始化 Android/iOS 工程等场景。
  - 工作流第一步必须询问并确认目标架构，无法确认时停止。
  - 包含 Expo、原生 Android、原生 iOS 模块差异和选择规则。
  - 包含创建命令、依赖管理、平台验证和失败停止条件。

### 子任务 3：升级 create-skill 分类门禁

- 产物：`.codex/skills/create-skill/SKILL.md`、`.codex/skills/create-skill/script/init_skill.py`、`.codex/skills/create-skill/script/quick_validate.py`
- 验收标准：
  - `init_skill.py --path skills` 缺少 `--category` 时失败。
  - `init_skill.py --path skills --category share` 生成到 `skills/share/<skill-name>`。
  - `init_skill.py --path <temp> --category react-native` 生成到 `<temp>/react-native/<skill-name>`。
  - `quick_validate.py` 拒绝普通 Skill 位于 `skills/<skill-name>` 根层级。

### 子任务 4：同步 Skill 目录说明与文档治理判断

- 产物：`skills/AGENTS.md`
- 验收标准：
  - `skills/AGENTS.md` 能体现 React Native App 创建 Skill 属于 `skills/react-native/`。
  - 根据 `docs/AGENTS.md` 判断单个 Skill 说明不写入长期文档系统，如修改模块级规则则同步受治理文档。

### 子任务 5：验证并提交

- 验收标准：
  - `.codex/skills/create-skill/script/quick_validate.py --strict skills/react-native/rn-create-app` 通过。
  - `rg` 验证“不确定架构禁止创建”类门禁存在。
  - `git diff --check` 通过。
  - 使用中文规范提交，提交信息以 `[AI]` 开头。

---

# react-native Skill 精简优化任务计划

## 总目标

压缩 `skills/react-native` 下已有 Skill 正文，删除教程式和重复描述，只保留触发、停止、执行、参考路由和反模式等必要指令。

## 子任务与验收标准

### 子任务 1：精简 `rn-create-app`

- 产物：`skills/react-native/rn-create-app/SKILL.md`
- 验收标准：
  - 保留创建 RN App 前必须确认的初始化路径、架构、版本、平台和包管理器。
  - 保留 Expo、Community CLI、既有原生 App 集成三条路径的必要分流。
  - 删除冗长示例和重复解释。

### 子任务 2：精简 `rn-newarch-modules-create`

- 产物：`skills/react-native/rn-newarch-modules-create/SKILL.md`
- 验收标准：
  - 保留 RN 版本、模块形态、平台范围、架构目标、JS spec、原生依赖的停止规则。
  - 保留 Android/iOS/C++ 的 reference 路由和最小验收要求。
  - 保留 RN `0.74+` 未明确新架构时需要先确认的门禁。

### 子任务 3：验证和文档治理判断

- 验收标准：
  - 两个 Skill 的 strict 校验通过。
  - `git diff --check` 通过。
  - 根据 `docs/AGENTS.md` 判断本次只修改单个 Skill 说明，不进入长期文档系统。
