## Test

本目录存放 Hybrid Agent Rail 的 Jest 单元测试。当前项目约定：所有 Jest 测试文件统一使用 TypeScript 编写，并使用 `.test.ts` 后缀。

## 测试文件规范

- 新增单元测试放在 `test/` 目录，文件名使用 `*.test.ts`。
- 使用 `@jest/globals` 导入 `test`、`expect` 等 Jest API。
- 测试逻辑优先校验可观察结果，例如 workspace 配置、package 脚本、依赖链、构建产物，而不是耦合内部实现细节。
- 读取 JSON、文本或文件系统状态时，优先使用 Node 标准库，并为测试内复用的数据结构补充必要的 TypeScript 类型。

## 当前测试入口

- `pnpm run test:workspace`：执行 `test/workspace.test.ts`，校验 pnpm workspace、根脚本和 workspace 依赖链。
- `pnpm run test:package-output`：执行 `test/package-output.test.ts`，校验 package 构建产物。
- `pnpm test`：完整验收链路，顺序为 workspace 测试、package 构建、构建产物测试、example smoke、example API。

## Jest 与 TypeScript

- Jest 配置位于 `jest.config.mjs`。
- TypeScript 测试通过 `ts-jest` 转译执行，测试脚本保留 `NODE_OPTIONS=--experimental-vm-modules` 以兼容当前 ESM 配置。
- 测试运行时追加 `--watchman=false`，避免本机 Watchman 权限或索引状态影响验收。
- package 构建的 Rollup TypeScript 插件只应处理当前 package 的 `src/**/*.ts`，避免根目录测试文件参与 package 构建。

## 验收要求

修改测试、Jest 配置、package 构建配置或根测试脚本后，至少运行：

```bash
pnpm run test:workspace
pnpm run build
pnpm run test:package-output
pnpm test
```

提交前对本次变更路径运行 `git diff --check`；如果工作区存在无关的用户改动，使用路径限定检查本次提交范围。
