# StyleSheet Patterns

## Core Rule

Prefer `StyleSheet.create` outside the component for stable styles. This keeps render logic clean, avoids recreating style objects on every render, and gives the component a readable visual vocabulary.

## Good Pattern

```tsx
import {StyleSheet, Text, View} from 'react-native';

export function UserBadge() {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Member</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
```

## Refactor Inline Styles

Before:

```tsx
<View style={{alignItems: 'center', justifyContent: 'center', width: 128}} />
```

After:

```tsx
<View style={styles.iconContainer} />

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 128,
  },
});
```

## Naming

- Name styles by role: `container`, `header`, `title`, `subtitle`, `imageContainer`, `iconContainer`, `primaryButton`.
- Avoid names tied to current values: `blueText`, `bigBox`, `left12`, `redBackground`.
- For repeated visual roles across files, check for existing shared components or theme tokens before copying values.
- Keep style objects close to the component unless they are shared through a deliberate theme or shared component boundary.

## Component Props

Allow external layout overrides through a narrow `style` prop when the component is meant to be composed:

```tsx
type Props = {
  style?: ViewStyle;
};

export function Panel({style}: Props) {
  return <View style={[styles.panel, style]} />;
}
```

The external `style` goes last only when consumers should be allowed to override local defaults. Put it earlier when local safety styles must win.

## Acceptance

- `StyleSheet` is imported from `react-native` when `StyleSheet.create` or `StyleSheet.absoluteFillObject` is used.
- Stable style objects are not created inside render.
- Style names communicate component intent.
- Shared style values use existing theme constants when the project has them.
