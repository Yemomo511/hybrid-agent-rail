# Flutter Official Notes

## Sources

- Flutter official site: https://flutter.dev/
- Flutter platform integration docs: https://docs.flutter.dev/platform-integration

## Official Positioning

- Flutter is an open-source framework for building beautiful, natively compiled, multi-platform applications from a single codebase.
- Flutter targets mobile, web, desktop, and embedded experiences.
- Official materials emphasize fast performance, hot reload productivity, and flexible pixel-level UI control.
- Flutter apps usually work across supported platforms once the development environment is set up, but each target may require platform tooling.
- Platform-specific functionality can be handled through plugins, platform-specific code, or custom plugins.

## Prefer Flutter When

- The product values a unified visual system, rich UI, animation, custom rendering, or consistent interaction across devices.
- The team can adopt Dart and Flutter's widget/rendering model.
- The target is Android+iOS with possible Web/Desktop expansion from one primary codebase.
- The product can rely on Flutter plugins or is prepared to write platform-specific integrations.
- Fast iteration and UI-heavy product work are key constraints.

## Be Careful When

- The highest priority is fully native platform UI behavior rather than a unified Flutter UI layer.
- The team has strong React/Vue/Kotlin assets and no appetite to adopt Dart.
- Mini Program distribution is a hard first-class requirement.
- Native SDKs are numerous, unstable, or require deep platform-specific UI embedding that the team cannot maintain.

## Decision Signals

- Strong signal for Flutter: “single codebase”, “beautiful UI”, “consistent design”, “mobile plus desktop/web”, “custom animation”.
- Weak signal for Flutter: “must look exactly like platform-native screens”, “mini program first”, “team refuses Dart”.
