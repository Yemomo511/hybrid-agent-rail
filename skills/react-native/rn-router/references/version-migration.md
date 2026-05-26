# Version And Migration

## Expo SDK And Expo Router

| 版本范围 | 使用姿势 |
| --- | --- |
| Expo SDK 56+ | 新默认模板包含 Expo Router；应用代码使用 `expo-router/*` 入口，不从 `@react-navigation/*` 直接导入 Expo Router 管理的 API |
| Expo SDK 54-55 | 可能已经使用 Expo Router，但迁移到 SDK 56 时重点检查 import path、typed routes、template 差异 |
| Expo SDK 52-53 | Expo Router 可用，但项目模板、typed routes 和 Web 能力可能与新文档不同；先查本项目版本文档 |
| 更旧 Expo SDK | 不要直接套用最新 Expo Router 指南；先评估升级 Expo SDK 或保留 React Navigation |

## Expo Router v3+ Notes

- Expo Router 管理根 `NavigationContainer`。
- `app` / `src/app` 是路由边界，非页面组件应移出路由目录。
- `Link` 使用 `href`；React Navigation 的 `Link` 常用 `to`。
- `resetRoot`、`getCurrentRoute`、`onStateChange` 等容器级 API 通常迁移为路径、segments 或 router 方法。

## React Navigation Versions

| 版本 | 使用姿势 |
| --- | --- |
| 7.x | 优先 static configuration；仍支持 dynamic API；最低要求按官方文档检查 RN、Expo Go、TypeScript |
| 6.x | 大量项目使用 dynamic API；升级到 7 前先读官方 upgrade guide，避免一次性改导航语义 |
| 5.x | 与 6.x 类似的 JSX 导航树，但类型、linking 和安装依赖可能不同 |
| 4.x 及更旧 | 历史 API 差异较大，按迁移任务处理，不直接套用 7.x 示例 |

## Migration From React Navigation To Expo Router

推荐顺序：

1. 记录现有导航树、route params、linking、埋点、权限和 back 行为。
2. 将 screen 组件拆为独立文件，并减少对 `navigation` / `route` props 的耦合。
3. 建立 `app` 或 `src/app` 路由目录，先迁移根 layout 和一条关键路径。
4. 把 route name 跳转迁移为路径跳转，把 params 迁移为 search params。
5. 用 route group 表达 tabs/auth/modal 等结构。
6. 验证 cold start deep link、Web 刷新、移动端返回、埋点名称和异常页面。

## Migration From Expo Router To React Navigation

只有在以下场景考虑反向迁移：

- 项目退出 Expo CLI/Metro 约束。
- 原生宿主 App 需要由原生导航控制 RN screen 生命周期。
- 业务强依赖 custom navigator、custom router 或独立 container。

迁移时先把路径映射为 route name 和 linking config，不要丢失原有 URL 兼容性。

## Red Flags

- “升级导航库”同时改页面结构、鉴权、埋点和 deep link，风险过大。
- 没有 deep link 验收就宣称 Expo Router 迁移完成。
- 从 React Navigation 6 升 7 时同时强行改成 Expo Router，导致问题来源不可分辨。
- 在旧 Expo SDK 中使用 SDK 56 的 import 规则而未升级依赖。
