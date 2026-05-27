# Dynamic And Platform Styles

## Dynamic Styles

Use style arrays to combine stable `StyleSheet` styles with the smallest possible runtime object:

```tsx
<View
  style={[
    styles.card,
    selected && styles.cardSelected,
    {opacity: disabled ? 0.5 : 1},
  ]}
/>
```

Move dynamic branches into named styles when the states are finite:

```tsx
<Text style={[styles.label, error ? styles.labelError : styles.labelNormal]} />
```

## Platform Styles

Use `Platform.select` or platform-specific files when style behavior differs meaningfully:

```tsx
import {Platform, StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  shadow: {
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
});
```

## Absolute And Overlay Styles

Use RN helpers for common overlay patterns:

```tsx
const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
});
```

Use `StyleSheet.absoluteFillObject` for spreading into a style object. Use `StyleSheet.absoluteFill` only when the project intentionally uses the registered style constant directly.

## Experimental Styles

- Treat fields prefixed with `experimental_` as version-sensitive.
- Check the target RN version before using them.
- Provide a fallback when a style is visual-critical, such as solid color behind an experimental gradient.

```tsx
const styles = StyleSheet.create({
  background: {
    borderRadius: 40,
    experimental_backgroundImage: 'linear-gradient(180deg, #3C9FFE, #0274DF)',
  },
  backgroundFallback: {
    backgroundColor: '#208AEF',
  },
});
```

## Precedence And Safety

- In `style={[base, variant, override]}`, later entries win.
- Avoid mixing several dynamic objects if a named state style would be clearer.
- Keep layout-critical styles last when consumers must not override them.
- Do not rely on negative margin or parent-outside touch areas without platform verification.

## Acceptance

- Dynamic style objects are minimal and justified by runtime input.
- Platform-specific differences are explicit.
- Experimental visual styles have version checks or fallbacks.
- Style arrays are ordered intentionally.
