# Cross-Platform Framework Decision Matrix

## Read First

Use this matrix only after the Selection Gate in `SKILL.md` is complete. If user profile, target platforms, team stack, native capability, and UI strategy are not known, ask questions first.

## Matrix

| Dimension | KMP | React Native | Flutter | uni-app |
| --- | --- | --- | --- | --- |
| Best user profile | Native/Kotlin-aware team | React/JS team | Dart/Flutter-ready UI team | Vue/Mini Program/front-end team |
| Primary platform fit | Android+iOS native apps, shared logic, optional shared UI | Android+iOS apps with React UI and native components | Android+iOS plus web/desktop from one UI codebase | Web, App, Mini Program, HarmonyOS, many channels |
| UI strategy | Native UI first or Compose shared UI by choice | Platform-backed native components through React | Unified Flutter-rendered UI, high visual control | Vue/SFC and platform runtimes, Mini Program-like conventions |
| Native integration | Strong direct platform API story; good for gradual native adoption | Good with native modules/components, but needs native maintenance | Plugin-first, platform channels/custom plugins when needed | uni APIs, plus APIs, uts/native plugins, conditional compilation |
| Performance posture | Native binaries and no bridge/VM for KMP shared code | Native views with JS runtime and native bridge/new architecture concerns | Natively compiled with Flutter rendering engine | Runtime/compiler model; App can use webview or nvue/native extensions |
| Learning curve | Higher for non-Kotlin/non-native teams | Lower for React/JS teams | Requires Dart and Flutter widget model | Lower for Vue/Mini Program teams |
| Weak fit | Mini Program first, no native/Kotlin skill | Many Mini Program channels, Vue-only teams | Mini Program first, no Dart appetite | Extreme native App fidelity/performance-heavy scenes |

## Recommendation Heuristics

- If the user wants App only, keeps native UI, has Android/Kotlin strength, and values gradual migration: prefer KMP.
- If the user wants App only or App-first, has React/TypeScript strength, and needs native SDK access: prefer React Native.
- If the user wants one UI codebase, strong custom UI, and mobile-first with possible web/desktop expansion: prefer Flutter.
- If the user wants Mini Program/Web/App/HarmonyOS channel coverage and has Vue/front-end strength: prefer uni-app.

## Conflict Handling

- “Mini Program first + extreme native performance”: present uni-app for channel coverage and native/Flutter/RN for App quality as separate tracks; do not pretend one framework optimizes both.
- “Complete beginner + all platforms”: ask for first release platform and team support; avoid choosing the broadest framework solely by target count.
- “Existing native App + wants no rewrite”: prefer KMP or React Native module integration depending on Kotlin/native versus React team strength.
- “React team + many Mini Programs”: compare RN for App and uni-app for Mini Program; recommend split strategy if both are first-class.
