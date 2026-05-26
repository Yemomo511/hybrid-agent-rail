# React Navigation

## Mental Model

React Navigation 是代码化导航库。你显式创建 navigator，注册 screen，配置 linking、headers、tabs、drawer 和 navigation state。

## Core Concepts

- `NavigationContainer`：根容器，负责保存导航状态、linking、theme、ref 和事件。Expo Router 项目通常不要手写它。
- Navigator：`createNativeStackNavigator`、`createBottomTabNavigator`、`createDrawerNavigator` 等，负责转场和 UI。
- Screen：navigator 中的页面注册项，名称通常是业务 route name。
- Group：为一组 screen 共享 options、权限或条件展示。
- Route object：包含 `name`、`key`、`params`。
- Navigation object：提供 `navigate`、`push`、`goBack`、`setOptions` 等操作。
- Hooks：`useNavigation`、`useRoute`、`useFocusEffect`、`useIsFocused`、`useNavigationState`。

## React Navigation 7 Default

React Navigation 7 推荐 static configuration：

- 用 `createXNavigator({ screens, groups, screenOptions })` 声明导航树。
- 用 `createStaticNavigation(RootStack)` 生成根导航组件。
- static config 可自动生成更好的 TypeScript 类型和 linking 配置。
- 动态 screen 列表、强运行时配置或历史代码仍可使用 dynamic API。

## Dynamic API

React Navigation 5/6 项目通常使用 JSX 形式：

- `<NavigationContainer>`
- `<Stack.Navigator>`
- `<Stack.Screen name="Home" component={HomeScreen} />`

维护旧项目时优先保持现有 API。只有在升级到 7 且目标是减少类型和 linking 样板时，再评估迁移 static config。

## Installation Notes

先安装核心包：

- `@react-navigation/native`

多数 navigator 还需要：

- `react-native-screens`
- `react-native-safe-area-context`

Expo 项目使用 `npx expo install` 安装 RN 原生依赖，以匹配 Expo SDK。Community CLI 项目按现有包管理器安装，并在 iOS 执行 pod install。

Android 若使用 `react-native-screens`，检查 `MainActivity.kt` / `MainActivity.java` 是否需要配置 fragment factory。若 Android predictive back 与当前 React Navigation 版本冲突，按官方文档关闭对应 callback。

## Linking

React Navigation 的 deep link 不是文件系统自动生成的，需要显式配置：

- `prefixes`：scheme、universal link domain。
- `screens`：route name 到 path 的映射。
- `parse` / `stringify`：参数转换。
- 嵌套 navigator 需要嵌套 linking 配置。

## Validation

- 根导航能渲染并跳转到目标 screen。
- TypeScript 能识别 route name 和 params。
- Android back、iOS swipe back、tab/drawer 行为符合产品预期。
- deep link 可冷启动并进入目标 screen。
