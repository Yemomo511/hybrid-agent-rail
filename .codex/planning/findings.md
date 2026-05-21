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
