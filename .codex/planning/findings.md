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
