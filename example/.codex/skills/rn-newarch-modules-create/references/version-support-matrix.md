# React Native TurboModule Version Support Matrix

## Purpose

按 RN 版本决定 TurboModule 创建方式。需要精确版本时，优先读取目标仓库 `package.json`，再对照官方版本页和 release notes。

## Version Matrix

| RN version | Architecture status | TurboModule strategy |
| --- | --- | --- |
| `0.82+` | New Architecture only. Legacy Architecture 已移除为可选路径之外的历史兼容对象。 | 新模块直接按 TurboModule/Codegen 创建，不设计 Legacy opt-out。 |
| `0.80-0.81` | Legacy Architecture frozen。新架构仍是默认方向，Legacy 只用于迁移尾部。 | 默认 TurboModule；只有用户明确要求迁移旧库时才读取 backward compatibility guide。 |
| `0.76-0.79` | New Architecture 默认启用，适合生产使用。 | 新模块默认 TurboModule；如果项目关闭 `newArchEnabled`，先问清迁移计划。 |
| `0.74-0.75` | New Architecture 可用但不要假设每个项目默认启用；启用 New Architecture 时 Bridgeless 默认。 | 先检查 Android `newArchEnabled` 和 iOS `RCT_NEW_ARCH_ENABLED`；启用后再按 TurboModule 创建。 |
| `0.68-0.73` | New Architecture/TurboModule 属于较早 opt-in 阶段，模板和文档与当前版本差异大。 | 读取 archived docs、ReactWG 和项目模板后再实现；避免照搬 RN 0.85 文档。 |
| `<0.68` | 不作为该 Skill 的主路径。 | 转为 Legacy NativeModule 兼容或升级评估任务。 |

## Decision Rules

- 如果用户没有指定版本，不要猜。先读取项目依赖；如果是新项目，优先使用当前稳定 RN，再按最新官方文档实现。
- 如果版本是 `0.82+`，不要建议 `newArchEnabled=false` 或 Legacy fallback。
- 如果版本是 `0.76-0.81`，先看项目是否人为关闭新架构；关闭时需要用户确认是短期迁移还是长期兼容。
- 如果版本是 `0.74-0.75`，Bridgeless 默认只在 New Architecture 启用时成立。
- 如果版本是 `0.68-0.73`，优先按照项目本身模板、ReactWG 迁移资料和 archived docs 做最小变更。

## Source Notes

- 最新官方文档版本选择器显示当前稳定线为 `0.85`。
- 官方 TurboModule 文档的基础步骤是 typed JS spec、Codegen、JS 调用和原生平台实现。
- RN 0.76 release notes 明确 New Architecture 默认启用。
- RN 0.80 release notes 明确 Legacy Architecture frozen。
- RN 0.82 release notes 明确 New Architecture 成为唯一架构。
- RN 0.74 release notes 明确 Bridgeless 在启用 New Architecture 时默认。
