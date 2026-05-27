# React Native Style Basics

## Source

- React Native Style docs: https://reactnative.dev/docs/style, last updated 2026-04-08.

## Core Concepts

- RN core components accept a `style` prop.
- Style names and values are close to CSS, but property names use camelCase, such as `backgroundColor`.
- A style can be a plain object or an array. In arrays, later styles take precedence.
- As components grow, prefer `StyleSheet.create` so stable styles live in one named object.
- A component can accept a `style` prop and pass it to an internal element to allow controlled external overrides.

## CSS Differences To Remember

- Do not use CSS selectors, class names, cascade rules, kebab-case properties, or stylesheet files as if this were web CSS.
- Values are usually numbers for density-independent pixels, not strings like `'12px'`.
- RN does not always match web CSS behavior. Known examples include touch areas not extending beyond parent view bounds and Android negative margin not being supported in some cases.
- Text styles apply to `Text`; layout/container styles usually belong on `View`; image sizing and resize behavior belong on `Image`.

## Style Prop Pattern

Use direct style references for stable styles:

```tsx
<View style={styles.container} />
```

Use arrays for composition or conditional overrides:

```tsx
<View style={[styles.container, disabled && styles.disabled]} />
```

Use inline objects only for tiny dynamic values that cannot be named cleanly:

```tsx
<View style={[styles.progressBar, {width: `${progress}%`}]} />
```

## Acceptance

- Stable style declarations are in `StyleSheet.create`.
- JSX remains readable: style props should point to names, not large objects.
- Style arrays have intentional precedence and do not hide accidental overrides.
