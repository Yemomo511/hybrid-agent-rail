# Expo Router

## Mental Model

Expo Router = URL-first file router + React Navigation powered layouts. 文件决定 route，`_layout.tsx` 决定 navigator，URL/deep link 是默认能力。

## File System Rules

- `app/` 或 `src/app/`: 只放 route。组件、hooks、constants 放到外层目录。
- `index.tsx`: 当前目录默认页；根目录第一个 `index.tsx` 对应 `/`。
- `_layout.tsx`: 当前目录的导航关系和共享 provider；根 `_layout.tsx` 替代传统 `App.tsx` 初始化位置。
- `(group)`: route group 不进入 URL，用来表达 tabs、auth、modal、marketing 等结构。
- `[id].tsx`: 动态 route；业务跳转使用 path + params，不再用 route name。
- `+not-found.tsx`: 处理未知路径；Web/deep link 项目优先补。

## Layout Primitives

| Primitive | 用途 | 关键判断 |
| --- | --- | --- |
| `Stack` | 层级推进、详情页、modal | 默认首选；目录内文件自动成为 stack route |
| `Tabs` | 底部 tab，JS 实现 | API 接近 React Navigation bottom tabs，适合普通移动端 |
| `NativeTabs` | 平台原生 tab | Android/iOS 追求系统行为时用；Web 需要替代实现 |
| `Drawer` | 侧边菜单 | SDK 56+ 由 `expo-router` 提供；旧 SDK 依赖不同 |
| `Slot` | 无 navigator 的布局占位 | 只包 header/footer/provider，不需要 push/back history |

## Navigation Primitives

- `Link href`: 声明式跳转，适合列表、菜单、tab trigger、Web 链接语义。
- `useRouter()`: 命令式跳转；优先 `navigate`，明确叠加用 `push`，替换登录态用 `replace`，返回用 `back`。
- `useLocalSearchParams()`: 读取当前页面 params；页面内标题、请求参数优先用它。
- `useGlobalSearchParams()`: 全局观察 params；埋点和全局状态同步谨慎使用。
- `usePathname()` / `useSegments()`: 路径观察；适合鉴权、埋点、分组判断。

## Stack Layout

最小结构：

```text
src/app/_layout.tsx      -> <Stack />
src/app/index.tsx        -> /
src/app/details.tsx      -> /details
src/app/products/[id].tsx -> /products/:id
```

规则：

- `Stack.Screen name` 匹配 route 文件名，不传 `component`。
- 公共 header 用 `screenOptions`；单页标题用页面内 `<Stack.Screen options={...} />`。
- SDK 55+ 可用 composition components 配 header，但仍处于更激进的写法；稳妥项目优先 options API。
- 只为真实独立导航历史创建嵌套 `_layout.tsx`；普通 URL 目录不需要再包一层 Stack。

## Tabs Layout

三种 tab：

- JavaScript tabs: `Tabs`，底层是 React Navigation bottom tabs；通用、可配置。
- Native tabs: `NativeTabs`，Android/iOS 原生外观和行为；Web 需要平台文件替代。
- Custom tabs: `expo-router/ui` 的 `Tabs` / `TabList` / `TabTrigger` / `TabSlot`，适合 Web 或强定制 UI。

推荐结构：

```text
src/app/_layout.tsx
src/app/(tabs)/_layout.tsx -> <Tabs />
src/app/(tabs)/index.tsx
src/app/(tabs)/settings.tsx
```

实践：

- 根 Stack 隐藏 `(tabs)` header：`<Stack.Screen name="(tabs)" options={{ headerShown: false }} />`。
- Tabs 内显式写 `Tabs.Screen` 来控制顺序、标题、icon、badge。
- Native/Web 分叉用 `app-tabs.native.tsx` + `app-tabs.tsx`，由 Expo module resolution 选择。

## Drawer Layout

- SDK 56+: `Drawer` 从 `expo-router/drawer` 导入；动画依赖 `react-native-reanimated`、`react-native-worklets`、`react-native-gesture-handler`。
- SDK 54-55: 通常还需要 `@react-navigation/drawer`。
- SDK 53 及更早: 依赖集合不同，先查对应版本文档，不套用最新安装命令。

适用：

- 平板/后台/内容类 App 的全局栏目。
- 需要 header button toggle 的侧边菜单。
- 不适合承载高频底部主任务；那通常是 Tabs。

## Source Links

- Expo core concepts: https://docs.expo.dev/router/basics/core-concepts/
- Expo layout: https://docs.expo.dev/router/basics/layout/
- Expo navigation: https://docs.expo.dev/router/basics/navigation/
- Expo stack: https://docs.expo.dev/router/advanced/stack/
- Expo tabs: https://docs.expo.dev/router/advanced/tabs/
- Expo drawer: https://docs.expo.dev/router/advanced/drawer/
