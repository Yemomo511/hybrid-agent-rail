# React Native Official Notes

## Sources

- React Native Core Components and Native Components: https://reactnative.dev/docs/intro-react-native-components
- React Native Introduction: https://reactnative.dev/docs/getting-started

## Official Positioning

- React Native is an open-source framework for building Android and iOS applications using React and the app platform's native capabilities.
- Developers use JavaScript to access platform APIs and describe UI behavior with React components.
- At runtime, React Native creates corresponding Android and iOS views; these platform-backed pieces are Native Components.
- The docs are written for a wide range of learners, but JavaScript fundamentals are a prerequisite.
- React Native supports custom Native Components and has a community ecosystem around platform-backed components.

## Prefer React Native When

- The team already knows React, JavaScript, TypeScript, Metro, or web-style component development.
- The target is primarily Android and iOS App, with web as a secondary concern handled separately or through compatible libraries.
- The product needs native components, native modules, or integration with existing Android/iOS SDKs while keeping most product UI in React.
- The organization wants to share product logic and UI patterns with React web teams.

## Be Careful When

- Mini Program or many domestic super-app channels are first-class targets.
- The team expects zero native knowledge; non-trivial RN apps still require Android/iOS build, native dependency, and release knowledge.
- Pixel-perfect identical rendering across all targets is more important than platform-backed native component behavior.
- Existing native SDK integration is heavy and the team cannot own TurboModule/native module maintenance.

## Decision Signals

- Strong signal for React Native: “React team”, “TypeScript”, “native SDK integration”, “Android+iOS App”, “reuse web team skill”.
- Weak signal for React Native: “Vue/miniprogram team”, “many mini programs”, “no JS/React foundation”.
