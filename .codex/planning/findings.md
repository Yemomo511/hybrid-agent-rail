# pnpm 项目初始化发现记录

## 当前事实

- 当前仓库已有 `package/hyar-adapter`、`package/hyar-cli`、`example` 空目录。
- 根 `package.json` 仍是 npm 单包默认形态，`test` 脚本固定失败。
- 当前只有 `LICENSE` 与 `README.md` 被 Git 跟踪，其余项目说明和目录为未跟踪状态。

## 决策

- 保留现有 `package/` 单数目录，不迁移到 `packages/`，避免破坏用户已经创建的目录意图。
- 包名采用用户给出的无 scope 名称：`hyar-cli`、`hyar-adapter`。
- `example` 包命名为 `hyar-example`，通过 workspace 协议依赖 `hyar-cli`。
- 包构建使用 Rollup，符合仓库前端开发规范中 npm package 打包工具要求。
- 单元测试统一切换到 Jest；当前已有测试均为 `.test.ts`，通过 `ts-jest` 转译执行。
- Jest 运行 ESM TypeScript 测试时通过 `NODE_OPTIONS=--experimental-vm-modules` 显式启用 VM Modules，并追加 `--watchman=false` 避免本机 Watchman 权限噪声影响验收。
- 原有 `pnpm test` 总流程保持不变，仍按 workspace 测试、构建、产物测试、example smoke、example API 的顺序验收。
- 用户进一步要求 Jest 测试文件统一使用 TypeScript，因此补充 `ts-jest`，并将已有 `.mjs` 测试迁移为 `.test.ts`。
- 迁移后 Rollup package 构建需要限制 TypeScript 插件输入范围到当前 package 的 `src/**/*.ts`，避免根目录测试文件影响 package 构建。
- 测试文档入口使用 `test/AGENTS.md`，用于沉淀 Jest TypeScript 测试文件规范、脚本职责与验收命令。

## 验证记录

- `pnpm run test:workspace` 通过，Jest 执行 3 条 workspace 用例。
- `pnpm run build` 通过，两个 package 均输出 Rollup ESM、CJS 与类型声明。
- `pnpm run test:package-output` 通过，Jest 执行 1 条产物用例。
- `pnpm test` 通过，包含 Jest 单测、构建、example smoke 与 example API 验收。
- 全量 `git diff --check` 被既有 README 未提交尾随空格拦截；本次待提交文件的 scoped `git diff --check` 已通过。
- TypeScript 测试迁移后，`pnpm run test:workspace`、`pnpm run build`、`pnpm run test:package-output` 与 `pnpm test` 均通过。

---

# hybrid-written-plan Skill 发现记录

## 当前事实

- `skills/AGENTS.md` 约定 Hyar Skill 对上游通用 Skill 做跨端补充。
- 上游 `superpowers:writing-plans` 要求输出细粒度实现计划、精确文件路径、TDD 步骤、验证命令和执行交接。
- 本次 Skill 不需要脚本或资产；核心价值是给计划阶段增加跨端原生影响和桥接形式决策。

## 决策

- Skill 命名为 `hybrid-written-plan`，放在仓库 `skills/` 下，作为 repo-local Skill。
- 不替代 `superpowers:writing-plans`，只要求在任务拆分前新增 `Hybrid Native Impact` 判断。
- 桥接决策覆盖 React Native old bridge、EventEmitter、TurboModule、Fabric/native component、Flutter MethodChannel、EventChannel、PlatformView、生成桥接和 native-only 路径。
- 由于该 Skill 是长期计划契约，新增 `docs/hybrid-written-plan-skill.md` 并同步 `docs/KNOWLEDGE.md`。

## 验证记录

- `/usr/bin/python3 /Users/bytedance/.codex/skills/.system/skill-creator/scripts/quick_validate.py skills/hybrid-written-plan` 通过。
- `node .codex/skills/create-doc/validate.mjs docs/hybrid-written-plan-skill.md` 通过。
- `node .codex/skills/create-doc/validate-knowlegdge.mjs docs/hybrid-written-plan-skill.md` 通过。
- `git diff --check` 通过。

---

# RN 拍照页面计划发现记录

## 当前事实

- 当前仓库是 `hybrid-agent-rail`，不是业务 RN App；仓库根 `package.json` 使用 `pnpm@10.33.2`，但用户给出的项目规范说明 React Native 项目应优先使用 `yarn` 管理依赖。
- 当前仓库没有可直接落地拍照页的 `App.tsx`、`android/`、`ios/` RN 工程目录，因此计划需要先落在“目标 RN 项目”中执行。
- 本仓库 `docs/hybrid-written-plan-skill.md` 明确要求跨端计划先回答是否涉及原生修改、Android/iOS 影响、桥接形式和原生验收路径。
- 记忆中该项目族的 RN 示例曾从 shell 升级为真实 RN App，验收经验表明不能只停留在 JS 页面，需要检查 native app scaffolding、Pods、Gradle 和真机/构建证据。

## 决策

- 默认方案选择成熟 RN 原生相机包，而不是自研 Android/iOS 相机桥。
- 默认首选 `react-native-vision-camera`，但必须在目标项目中验证 RN 版本、Android minSdk、iOS deployment target、新架构设置和 Pod 能力后才能锁定版本。
- 业务层将拍照页封装为页面 + Hook + 类型契约；上传、压缩、OCR、相册保存等后续业务不纳入首轮页面范围，避免把拍照能力和业务流程耦合。
- 模拟器只能作为 UI 和权限状态验收，真实拍照成功必须使用真机或可用摄像头环境补充验收。

## 开放问题

- 目标 RN 项目的路径、RN 版本、React 版本、是否启用 New Architecture 尚未提供。
- 页面是需要“嵌入现有导航栈返回结果”，还是独立页面通过 callback 返回结果，需在实现前确认。
- 是否需要相册选择、图片压缩、裁剪、水印、扫码、连续拍摄、多图结果，当前计划默认不包含。

---

# Rollup 配置内置到 package 发现记录

## 当前事实

- 当前根目录存在 `config/rollup.package.config.mjs`，两个 package 的 `build` 脚本都通过 `../../config/rollup.package.config.mjs` 使用共享配置。
- 当前 workspace package 只有 `hyar-adapter` 和 `hyar-cli`。
- `docs/workspace-package-contract/doc.md` 将共享 Rollup 配置记录为稳定契约，因此迁移后需要同步文档系统。
- 当前工作区已有用户侧改动：`package/hyar-adapter/AGENTS.md`，本次迁移不触碰该文件。

## 决策

- 每个 package 放置自己的 `rollup.config.mjs`，并让 `build` 脚本直接执行 `rollup -c`。
- 继续复用根目录 `tsconfig.base.json` 和根 devDependency 中的 Rollup/TypeScript 工具链，避免把构建依赖重复声明到每个 package。
- 配置逻辑保持与旧共享配置一致，仅将 `packageDir` 从 `process.cwd()` 收敛到配置文件所在目录，保证从根递归构建和 package 目录单独构建都稳定。

## 验证记录

- 红灯阶段 `pnpm run test:workspace` 失败，证明根共享配置仍存在且 package 本地配置尚未落地。
- `pnpm run test:workspace` 通过，Jest 执行 4 条 workspace 用例。
- `pnpm run build` 通过，两个 package 均使用各自 `rollup.config.mjs` 输出 ESM、CJS 与类型声明。
- `pnpm run test:package-output` 通过，产物验收保持绿色。
- `pnpm test` 通过，包含 package 代码质量、workspace 测试、构建、产物测试、example smoke 与 example API。
- `node .codex/skills/create-doc/validate.mjs docs/workspace-package-contract/doc.md` 通过。
- `node .codex/skills/create-doc/validate-knowlegdge.mjs docs/workspace-package-contract/doc.md` 通过。
- `git diff --check` 通过。

---

# create-doc 文档目录化改造发现记录

## 当前事实

- 当前 `create-doc` Skill、模板和校验命令在改造前仍以扁平 Markdown 文件为目标形态。
- 当前受治理文档为 8 个 `docs/*.md` 文件，均已登记在 `docs/KNOWLEDGE.md` 的 `## Source` 中。
- `docs/AGENTS.md` 与 `docs/KNOWLEDGE.md` 是文档系统控制文件，不属于受治理文档，不迁移为 `doc.md`。
- 当前 `validate.mjs` 只要求路径在 `docs/` 下且以 `.md` 结尾，因此旧扁平路径仍会通过。
- 当前 `validate-knowlegdge.mjs` 只按 meta 匹配 Source 条目，未校验链接目标是否与传入文档路径一致。

## 决策

- 受治理文档目录名采用 frontmatter `name`，正文固定为 `doc.md`。
- Knowledge Source 链接目标采用相对 `docs/KNOWLEDGE.md` 的 `<name>/doc.md`。
- 校验器错误信息需要直接提示期望格式 `docs/<name>/doc.md` 或 `<name>/doc.md`。
- 本次不新增 npm 依赖，不改 package 构建链路。

## 验证记录

- 隔离 worktree 初始状态下，现有 8 个扁平文档均通过旧版 `validate.mjs` 与 `validate-knowlegdge.mjs`。
- 红灯测试 `node --test .codex/skills/create-doc/__test__/create-doc-layout.test.mjs` 在旧实现上失败 3 项：旧文档路径被放过、旧 Knowledge 链接被放过、错链 Knowledge 被放过。
- 改造后红灯测试通过，确认 `validate.mjs` 拒绝旧路径，`validate-knowlegdge.mjs` 会校验 Source 链接目标与传入文档路径一致。
- 8 个受治理文档迁移到 `docs/<name>/doc.md` 后，逐个通过 `validate.mjs` 与 `validate-knowlegdge.mjs`，全局 Knowledge Source 校验通过。
- 最终验证中，validator 单测、全量文档校验、旧具体路径引用扫描和 `git diff --check` 均通过。
