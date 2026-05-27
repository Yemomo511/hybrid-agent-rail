---
description: 编写、重构或审查 React Native 组件样式时使用。适用于处理 style prop、StyleSheet.create、样式数组、动态样式、平台样式差异、组件内联样式坏味道、Text/Image/View 样式组织、布局样式复用和样式可维护性问题；缺少 RN 版本、目标组件边界或现有样式约定时必须先读取项目事实或询问。
name: rn-compo-style
---

## Rn Compo Style

## Overview

为 React Native 组件编写样式时，优先把稳定样式放入 `StyleSheet.create`，组件 JSX 中只引用样式名或少量动态覆盖。只有一次性、极小、确实依赖运行时值的样式才考虑内联对象。

## When To Invoke

- 用户要求新增、调整、重构或审查 RN 组件样式。
- 用户提到 `style`、`StyleSheet.create`、样式数组、布局、颜色、Text/Image/View 样式或平台差异。
- 代码中出现大量 JSX 内联样式，需要改成可维护的样式命名。

## Workflow

1. 读取当前文件和邻近组件，确认 import、样式命名、主题常量和组件拆分方式。
2. 需要 RN Style 基础语义时读取 `references/style-basics.md`。
3. 需要把组件样式落成可维护代码时读取 `references/stylesheet-patterns.md`。
4. 需要处理动态样式、样式数组、平台分支或覆盖关系时读取 `references/dynamic-and-platform-styles.md`。
5. 编码时把 `const styles = StyleSheet.create(...)` 放在组件外；样式名表达用途，不表达具体颜色或数值。
6. JSX 中优先使用 `style={styles.name}` 或 `style={[styles.base, condition && styles.active]}`；避免大段 `style={{...}}`。
7. 验收时检查可读性、平台行为、布局不重排、样式没有覆盖错序，并运行项目已有 lint/type/test 命令。

## Reference Routing

- `references/style-basics.md`：理解 RN 官方 Style 语义、CSS 相似点和已知差异时读取。
- `references/stylesheet-patterns.md`：写 `StyleSheet.create`、命名样式、拆分组件样式和重构内联样式时读取。
- `references/dynamic-and-platform-styles.md`：处理样式数组、动态覆盖、主题、平台差异和 experimental 样式时读取。

## Anti-Patterns

- 在 JSX 中堆大段对象：`style={{width: 201, height: 201, position: 'absolute'}}`。
- 把稳定样式写成函数每次 render 新建对象，却没有动态输入。
- 样式名叫 `blueText`、`bigBox`，导致设计变化后名称失真；应使用 `title`、`imageContainer`、`primaryAction`。
- 复制 Web CSS 思维，直接使用 kebab-case、字符串尺寸、选择器、级联或不受 RN 支持的属性。
- 依赖负 margin、父级外触摸区域等 Web 行为，却没有验证 Android/iOS 差异。

## Good Example

```tsx
import {StyleSheet} from 'react-native';

// JSX usage keeps style props readable:
// style={styles.imageContainer}
// style={styles.glow}
// style={styles.iconContainer}
// style={styles.background}

const styles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: 201,
    height: 201,
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 128,
    height: 128,
    zIndex: 100,
  },
  image: {
    position: 'absolute',
    width: 76,
    height: 71,
  },
  background: {
    borderRadius: 40,
    experimental_backgroundImage: 'linear-gradient(180deg, #3C9FFE, #0274DF)',
    width: 128,
    height: 128,
    position: 'absolute',
  },
  backgroundSolidColor: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#208AEF',
    zIndex: 1000,
  },
});
```
