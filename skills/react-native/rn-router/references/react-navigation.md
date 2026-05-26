# React Navigation

## Mental Model

React Navigation = explicit navigation tree. 你创建 navigator，注册 screen，配置 state、linking、headers、gestures 和 platform behavior。

## Core Concepts

- `NavigationContainer`: 根容器，保存 navigation state、linking、theme、ref、事件。Expo Router 项目通常不要手写。
- Navigator: `createNativeStackNavigator`、`createStackNavigator`、`createBottomTabNavigator`、`createDrawerNavigator`。
- Screen: route name + component + options。
- Group: 一组 screen 的共享 options、权限或条件。
- Navigation object: `navigate`、`push`、`goBack`、`setOptions`。
- Route object: `name`、`key`、`params`。
- Hooks: `useNavigation`、`useRoute`、`useFocusEffect`、`useIsFocused`、`useNavigationState`。

## API Style

- React Navigation 7 默认优先 static configuration: `createXNavigator({ screens, groups, screenOptions })` + `createStaticNavigation(Root)`.
- React Navigation 5/6 和大量历史项目使用 dynamic API: `<Navigator><Screen /></Navigator>`.
- 新项目优先 static；已有项目优先延续当前 API，除非升级目标明确是类型、linking 或结构统一。

## Stack vs Native Stack

| Navigator | 何时使用 | Tradeoff |
| --- | --- | --- |
| `@react-navigation/native-stack` | 默认移动端 Stack、性能优先、需要 iOS large title/form sheet/native transition | 原生能力强，定制边界受平台限制 |
| `@react-navigation/stack` | 需要高度自定义 transition/header/gesture，或历史项目已使用 | JS 实现更灵活，性能和平台原生行为不如 native-stack |

实践：

- 新移动端 App 默认 `native-stack`。
- 只有自定义转场/头部强依赖时选择 JS stack。
- Stack 嵌 Tabs 时常隐藏 `HomeTabs` 这一层 header。

## Bottom Tabs

- 包：`@react-navigation/bottom-tabs`。
- Route 懒加载，初次 focus 才 mount。
- 常用 options: `tabBarLabel`、`tabBarIcon`、`tabBarBadge`、`tabBarStyle`、`tabBarPosition`、`tabBarHideOnKeyboard`。
- 自定义 tab bar 时不要在 `tabBar` 组件里用 `useNavigation`; 使用传入的 `navigation` prop。
- 大屏 sidebar 可用 `tabBarPosition: 'left' | 'right'`，移动端默认 bottom。

## Drawer

- 包：`@react-navigation/drawer`。
- 依赖：`react-native-gesture-handler`、`react-native-reanimated`、`react-native-worklets`。
- 用途：侧边菜单、管理后台、平板多栏目、低频全局入口。
- 若只需要抽屉交互但不接入 navigation state，考虑直接使用 drawer layout 库，而不是 drawer navigator。
- 常用动作：`DrawerActions.openDrawer()`、`closeDrawer()`、`toggleDrawer()`。

## Nesting Navigators

嵌套就是把一个 navigator 当作另一个 navigator 的 screen。

规则：

- 每个 navigator 有自己的 history、options、params 和 events。
- 父 navigator 不会自动知道子 screen options；需要显式桥接 header/title。
- route params 不会自动穿透多层 navigator。
- 避免“每个目录/页面一个 navigator”；只有需要独立 history 或 UI chrome 时嵌套。

常见结构：

```text
RootStack
  AuthStack
  MainTabs
    HomeStack
    SettingsStack
  ModalStack
```

## Installation Notes

- 核心包：`@react-navigation/native`。
- 常见依赖：`react-native-screens`、`react-native-safe-area-context`。
- Expo 项目用 `npx expo install` 匹配 SDK。
- Community CLI 按 lockfile 包管理器安装，iOS 运行 pod install。
- Drawer/JS Stack 额外依赖 gesture/reanimated/masked-view 时按目标 navigator 文档补。

## Linking

React Navigation deep link 需要显式配置：

- `prefixes`: scheme、universal link domain。
- `screens`: route name 到 path 的映射。
- `parse` / `stringify`: 参数转换。
- 嵌套 navigator 需要嵌套 linking config。

## Source Links

- Stack navigator: https://reactnavigation.org/docs/stack-navigator/
- Native stack navigator: https://reactnavigation.org/docs/native-stack-navigator/
- Bottom tabs navigator: https://reactnavigation.org/docs/bottom-tab-navigator/
- Drawer navigator: https://reactnavigation.org/docs/drawer-navigator/
- Nesting navigators: https://reactnavigation.org/docs/nesting-navigators/
