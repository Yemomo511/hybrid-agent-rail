# Expo Router

## Mental Model

Expo Router 是 Expo/RN 的文件路由框架。文件和目录定义 route，layout 定义导航容器和共享 UI，URL/deep link 是一等概念。

## Core Concepts

- `app/` 或 `src/app/`：路由根目录。非页面组件放在目录外，例如 `components/`。
- `index.tsx`：当前目录的默认 route，根目录的第一个 `index.tsx` 是 `/`。
- `_layout.tsx`：当前目录的导航 layout，替代传统 `App.tsx` 中的导航入口、provider 和 splash 初始化位置。
- Route group：`(tabs)` 这类括号目录不进入 URL，用于组织 tabs、auth、modal 等导航分组。
- Dynamic route：`[id].tsx` 表示动态参数；catch-all 使用更高级的 bracket 语法时先查官方文档。
- `Link href`：声明式跳转，使用路径而不是 React Navigation 的 route name。
- `useRouter()`：命令式跳转，常用 `push`、`replace`、`back`。
- `useLocalSearchParams()`：读取当前 route 参数；全局参数观察用 `useGlobalSearchParams()`。
- `usePathname()` / `useSegments()`：观察当前路径和分段，适合埋点、权限和 tab 内路径判断。

## Installation Shape

新 Expo 项目优先使用官方默认模板；已有 Expo 项目添加 Expo Router 时检查：

- `expo-router`、`react-native-safe-area-context`、`react-native-screens`、`expo-linking`、`expo-constants`、`expo-status-bar`。
- `package.json` 的 `main` 指向 `expo-router/entry`，或自定义入口最后 `import 'expo-router/entry'`。
- `app.json` / `app.config.*` 配置 `scheme`；需要 typed routes 时启用对应实验配置。
- `babel.config.js` 使用 `babel-preset-expo`。
- 使用 `src/app` 时，`tsconfig.json` 配置 `@/*` 到 `src/*` 并包含 `.expo/types/**/*.ts`。

## SDK 56+ Import Rule

Expo SDK 56 之后，应用代码不要从 `@react-navigation/*` 导入 Expo Router 管理的导航 API。优先从 `expo-router` 或 `expo-router/react-navigation` 导入：

- 跳转：`useRouter`、`Link` 来自 `expo-router`。
- 参数：`useLocalSearchParams`、`useGlobalSearchParams` 来自 `expo-router`。
- 主题桥接：`ThemeProvider`、`DarkTheme`、`DefaultTheme` 可从 `expo-router/react-navigation` 获取。

## Migration Notes

从 React Navigation 迁移时：

- 先把每个 screen 拆成独立文件。
- route name 迁移为路径；初始页面命名为 `index.tsx`。
- `navigation.push('User', params)` 迁移为 `router.push({ pathname: '/users/[id]', params })` 或具体路径。
- `route.params` 迁移为 `useLocalSearchParams()`。
- 全局 `NavigationContainer` 交给 Expo Router 管理。
- `onStateChange` 类埋点改用 `usePathname()`、`useSegments()` 配合 `useEffect`。

## Validation

- `npx expo start --clear` 能启动。
- 移动端可从首页进入目标页面并返回。
- deep link 可直达动态页面并正确读取参数。
- Web 目标页面刷新后仍渲染正确；浏览器前进/后退符合预期。
