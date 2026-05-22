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

---

# create-curated-skill metadata 元数据改造发现记录

## 当前事实

- `skills/skill-template.md` 已展示 `metadata.version`、`metadata.env` 的目标形态。
- `.codex/skills/create-curated-skill/` 的模板、示例和校验器仍使用或允许顶层 `version`、`env`。
- 当前 `skills/` 下 curated Skill 未出现顶层 `version` 或 `env`，因此本次不需要迁移既有 curated Skill 产物。

## 决策

- `name`、`description` 继续作为 frontmatter 顶层必选字段。
- `version`、`env` 迁移为 `metadata` 下的一层可选字段，用来展示框架版本兼容和跨端环境要求。
- 校验器只实现当前模板需要的一层 metadata 解析，不引入 YAML 依赖，避免扩大 npm 环境变更范围。

---

# create-skill good-example TurboModule 完善发现记录

## 当前事实

- `.codex/skills/create-skill/reference/good-example/SKILL.md` 存在但仍保留 `<Skill Name>`、`<Skill Github Url>`、`<Custom Description>` 等模板占位内容。
- React Native 0.79 官方 Turbo Native Modules 文档把实现链路拆为：声明 typed JS/TS Spec、配置 Codegen、用 Spec 写 JS 业务调用、用生成接口实现并接入原生平台。
- RN 0.79 文档示例强调 Spec 文件名应以 `Native` 前缀命名，`codegenConfig.type` 使用 `modules`，Android 可通过 Gradle `generateCodegenArtifactsFromSchema` 生成产物，iOS 通过 CocoaPods script phase 运行 Codegen。
- 官方 0.79 iOS 示例使用 Objective-C++ 类实现 generated Spec，并通过 `codegenConfig.ios.modulesProvider` 绑定 JS module name 到原生实现类。

## 决策

- good-example 作为 create-skill 的参考样板，不额外拆分 reference 文件，保持一个可读的完整 SKILL 示例。
- TurboModule Skill 默认面向 RN New Architecture；如果项目需要 Legacy Architecture 兼容，要求先走兼容性设计，不把旧桥和 TurboModule 混写成默认路径。
- iOS 指导以 Objective-C++ 注册和实现为主；Swift 只作为业务实现可被 Objective-C++ 适配层调用的可选内部实现。

---

# RN TurboModule Skill 中文化发现记录

## 当前事实

- RN TurboModule good-example 已是完整 Skill 示例，但说明性内容主要为英文。
- 用户要求“翻译为中文，不适用英文”，因此本次只翻译自然语言说明，不改代码、命令、API 名称和框架术语。

## 决策

- 技术专有名词如 `TurboModule`、`Codegen`、`Spec`、`TurboModuleRegistry` 保持原样，避免影响 React Native 语义。
- 示例代码块保持原样，保证后续 Agent 能直接复制和迁移。

---

# skill-template 基础模板补充发现记录

## 当前事实

- `skills/skill-template.md` 已包含用户要求的基础 frontmatter、`metadata.version/env`、`When To Invoke`、可选 Source/How to use 和自定义描述区域。
- `.codex/skills/create-skill/script/init_skill.py` 的内置模板包含 `Overview`、结构选择、资源目录说明等更完整的 Skill 创建提示。
- 当前 `docs/skill-system-contract/doc.md` 仍笼统要求模板内聚到维护型 Skill 中，但仓库实际保留了 `skills/skill-template.md` 作为基础作者模板。

## 决策

- 不替换 `skills/skill-template.md` 的基本模板，只在其基础上补充结构指引。
- 资源说明沿用 `scripts/`、`references/`、`assets/` 三类，并用中文解释适用场景。
- 文档系统同步承认 `skills/skill-template.md` 是保留的基础 Skill 作者模板，避免规则漂移。

---

# create-skill 生成与校验标准化发现记录

## 当前事实

- `.codex/skills/create-skill/script/init_skill.py` 仍使用英文模板，并依赖缺失的 `generate_openai_yaml.py` 生成 `agents/openai.yaml`。
- `.codex/skills/create-skill/script/quick_validate.py` 是空文件，无法验证生成结果。
- `skills/skill-template.md` 已将 `Source` 改为 `Upstream Skill`，其语义是 Skill 依赖和补充关系，不是文档来源。

## 决策

- 移除 `agents/openai.yaml` 生成链路，生成产物固定为 `SKILL.md` 和可选资源目录。
- `quick_validate.py` 采用默认/strict 双模式，兼顾刚生成的模板和完成后的 Skill。
- 校验器显式拒绝将文档、API、模块、页面、参考资料写入 `Upstream Skill`。

---

# create-skill curated Skill 防误改发现记录

## 当前事实

- `skills/flutter/*/SKILL.md` 是 curated Skill，正文包含 `> Curated from ...`，并保留严格 `Source` 与 `How to use` 模板。
- `create-skill` 生成的是普通 repo-local Skill 模板，不能套用到 curated Skill。

## 决策

- 将 `skills/flutter` 作为当前仓库的 curated Skill 路径防护。
- `quick_validate.py` 同时用路径和 `> Curated from ...` 内容识别 curated Skill。
- 遇到 curated Skill 时统一提示使用 `create-curated-skill`。

---

# rn-create-app Skill 创建与分类迁移发现记录

## 当前事实

- 用户明确要求基于 React Native 官方环境搭建资料，分析 RN 0.74 到 0.85，以及 0.85 之前版本，并比较 Expo 与原生 Android/iOS 模块差异。
- React Native 官方当前版本页显示最新稳定版本为 0.85；0.85 release blog 给出的新项目命令是 `npx @react-native-community/cli@latest init MyProject --version latest`，并说明 Expo SDK 56 将包含 RN 0.85。
- RN 0.74 release blog 明确：新架构启用时 Bridgeless 默认、Yoga 3.0、Yarn 3 默认用于 Community CLI 新项目，Android 最低 SDK 提升到 23，并移除新项目中的 Flipper 原生库设置。
- RN 0.76 New Architecture 官方文章和架构页明确：0.76 起新架构在所有 RN 项目中默认启用；可通过 Android `newArchEnabled=false` 等方式退出。
- React Native 官方环境页强调：使用 Framework 时不必先安装完整 Android Studio/Xcode 原生环境；如果不用 Framework 或要写自己的 Framework，则本地原生环境是要求。
- Expo 官方 CNG/Prebuild 文档说明：`create-expo-app` 项目默认可通过 `npx expo prebuild` 生成 `android/` 与 `ios/`，原生修改应优先通过 config plugins 或 native modules 表达；Expo Go 只能使用 Expo Go 运行时内置的原生能力。

## 决策

- Skill 命名为 `rn-create-app`，放在 `skills/react-native/` 分类目录，属于 Hybrid Info Skill。
- Skill 的核心门禁是“先确认架构再创建”：必须确认 Expo managed/CNG、React Native Community CLI 新应用、已有 Android/iOS 集成、Legacy Architecture 兼容需求、目标 RN 版本和平台范围。
- 默认推荐路径按官方当前口径选择 Expo Framework 或 RN Community CLI，但不在用户架构不明确时自行决定。
- 版本分层采用：
  - RN < 0.74：按旧架构/桥接兼容优先处理，创建前需要确认历史依赖约束。
  - RN 0.74-0.75：新架构能力增强但不是所有新项目默认启用，需确认 `newArchEnabled`。
  - RN 0.76-0.84：新架构默认启用，但 0.85 之前仍按对应版本模板和依赖矩阵锁定。
  - RN 0.85：当前稳定版本，Node 需要符合 0.85 release 要求，Jest preset 迁移到 `@react-native/jest-preset`。
- 普通 repo-local Skill 采用 `skills/<category>/<skill-name>` 分类目录；React Native 放 `skills/react-native/`，跨端通用放 `skills/share/`，语言专属放 `skills/dart/`、`skills/kotlin/` 等目录，新框架新建 `skills/<framework>/`。
- `create-skill` 生成器和校验器都执行分类门禁：`--path skills` 必须指定 `--category`，普通 Skill 不允许直接位于 `skills/<skill-name>` 根层级。
- 单个 Skill 的说明根据 `docs/AGENTS.md` 不写入长期文档系统；修改了 Skill 分类模块规则，因此同步 `skills/AGENTS.md` 与 `docs/skill-system-contract/doc.md`。

## 验证记录

- `python3 .codex/skills/create-skill/script/quick_validate.py --strict skills/react-native/rn-create-app` 通过。
- `rg -n "禁止直接创建|停止创建|不要用|用户架构不明确|Stop Rule|references/rn-version-architecture" skills/react-native/rn-create-app skills/AGENTS.md` 命中 Skill 门禁与参考资料入口。
- `node .codex/skills/create-doc/validate.mjs docs/skill-system-contract/doc.md` 通过。
- `node .codex/skills/create-doc/validate-knowlegdge.mjs docs/skill-system-contract/doc.md` 通过。
- `python3 .codex/skills/create-skill/script/init_skill.py demo-rn-final --path .temp/create-skill-test-final --category react-native --resources references` 通过，生成到 `.temp/create-skill-test-final/react-native/demo-rn-final`。
- `python3 .codex/skills/create-skill/script/init_skill.py demo-root-final --path skills` 按预期失败，提示必须指定 `--category`。
- `python3 .codex/skills/create-skill/script/init_skill.py demo-share-final --path skills --category share` 通过，验证后删除生成的临时 `skills/share/demo-share-final/SKILL.md`。
- `python3 .codex/skills/create-skill/script/quick_validate.py .temp/create-skill-test/skills/root-skill` 按预期失败，拒绝根层普通 Skill。
- `python3 .codex/skills/create-skill/script/quick_validate.py skills/flutter/flutter-add-widget-test` 按预期失败，保持 curated Skill 防误改。
- `git diff --check` 通过。
