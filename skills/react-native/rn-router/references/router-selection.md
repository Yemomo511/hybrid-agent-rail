# Router Selection

## Decision Matrix

| 场景 | 默认选择 | 原因 |
| --- | --- | --- |
| 新 Expo App、Universal App、需要 Android/iOS/Web 同构路由 | Expo Router | 文件路由、自动 deep link、typed routes、Web static rendering 更省维护成本 |
| 新 Expo App 但已有团队标准 React Navigation 配置 | React Navigation | 保持团队既有导航抽象、埋点和测试工具稳定 |
| Community CLI App 或既有原生宿主集成 RN | React Navigation | 不依赖 Expo Router 与 Expo CLI 的 bundler/entry 约定 |
| 已有复杂 `NavigationContainer`、custom linking parser、custom navigator | React Navigation | 代码化导航树和自定义状态控制更直接 |
| 需要 URL 即路由、分享链接、页面级错误隔离、Web 刷新保持页面 | Expo Router | 文件路径天然对应 URL，并生成路由类型 |
| 仅移动端、导航层强依赖业务状态和运行时动态 screen 列表 | React Navigation | Dynamic API 和自定义 navigator 更灵活 |

## Use Expo Router When

- 项目是 Expo CLI 管理，或可接受使用 Expo CLI/Metro 运行。
- 新项目希望以 `app` 或 `src/app` 作为路由入口。
- 页面应该天然支持 deep link、URL 分享、Web 刷新、typed routes。
- 迁移目标是减少手写 linking、screen registry 和 nested navigator 样板。

## Use React Navigation When

- 项目是 Community CLI，或 RN 嵌入既有 Android/iOS 原生 App。
- App 已有稳定 React Navigation 5/6/7 结构，且本次只是加页面或修 bug。
- 需要完全控制 navigation state、custom router、custom navigator、独立 container 或特殊 back 行为。
- 团队已有基于 route name 的埋点、权限、灰度、测试工具，迁移收益不够明确。

## Mixed Strategy

Expo Router 内部使用 React Navigation 能力，但业务代码不应同时维护两套顶层路由入口。若必须混用：

- 让 Expo Router 管理根入口和 `NavigationContainer`。
- 自定义 navigator 通过 Expo Router layout 或 `withLayoutContext` 接入。
- 旧 React Navigation 页面先拆成独立 screen 文件，再逐步搬入 `app`/`src/app`。

## Decision Output

给用户输出选型结论时必须包含：

1. 选择 Expo Router 或 React Navigation。
2. 依据的项目事实，例如 Expo SDK、`app/` 目录、现有 `NavigationContainer`。
3. 迁移或新增的最小路径。
4. 验收命令和 deep link/Web 验收方式。
