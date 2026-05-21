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

- 产物：`docs/workspace-package-contract.md`
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
