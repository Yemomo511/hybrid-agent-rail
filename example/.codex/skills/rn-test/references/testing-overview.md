# React Native Testing Overview

## Source

- React Native Testing Overview: https://reactnative.dev/docs/testing-overview, last updated 2026-04-08.
- React Native 0.85 release note: https://reactnative.dev/blog/2026/04/07/react-native-0.85. RN `0.85+` uses `@react-native/jest-preset` instead of `preset: 'react-native'`.

## Testing Pyramid

| Layer | Use For | Common Tools | Typical Command |
| --- | --- | --- | --- |
| Static analysis | Syntax, style, type drift | ESLint, TypeScript | `yarn lint`, `yarn tsc --noEmit` |
| Unit | Pure functions, classes, hooks with small seams | Jest | `yarn test path/to/file.test.ts` |
| Mock-backed tests | Native modules, network, storage, time | Jest mocks, manual mocks | `yarn test` |
| Integration | Multiple app modules cooperating | Jest, React Native Testing Library, MSW or service mocks | `yarn test feature` |
| Component | RN rendering and user interaction | React Native Testing Library | `yarn test Component.test.tsx` |
| Snapshot | Small stable render output regression | Jest snapshots | `yarn test -u` only after review |
| E2E | Critical flows on simulator, emulator, or device | Detox, Appium, Maestro | project-specific |

## Core Concepts

- Testing is a feedback ladder: use cheaper checks first, then move upward only when lower layers cannot prove the risk.
- Testable RN code separates business logic and app state from React components.
- A strong RN test suite usually has many static/unit/component tests and a small number of E2E tests for vital paths.
- Failed tests are useful signals. For bug fixes, a failing regression test should expose the bug before the implementation changes when feasible.

## Selection Rules

- Start with static analysis and fast Jest tests before reaching for E2E.
- Put business rules in testable modules outside React components; cover them with unit tests.
- Use component tests for user-visible behavior: text, accessibility, input, press, loading, error and empty states.
- Use integration tests when the risk lives between modules, such as screen + hook + service + state store.
- Use E2E only for critical paths: authentication, purchase, permissions, native SDK flows, navigation paths that JS tests cannot prove.
- Use snapshots sparingly for small stable components; prefer explicit expectations when behavior can be asserted directly.

## Good Test Cases

- Name tests with Given/When/Then or Arrange/Act/Assert.
- Keep one behavior per test. Split tests that contain unrelated actions or multiple independent expectations.
- Make each test independent. Do not rely on order, shared mutable state, existing local storage, network, time, or previous test output.
- Prefer real modules unless the dependency is slow, unstable, native-only, external, or hard to make deterministic.

## Tool Handling

1. Prefer existing `package.json` scripts over inventing new commands.
2. If a script is absent but dependencies exist, run the direct tool command with the project package manager.
3. If dependencies are absent, propose the smallest dependency set for the requested layer and explain why that layer is needed.
4. For RN `0.85+`, use `@react-native/jest-preset`; for older projects, inspect the existing template before changing `preset: 'react-native'`.
5. If a device, simulator, Watchman, Metro, Gradle, CocoaPods, or private registry blocker prevents verification, report the exact blocker and the next command instead of claiming success.

## Common Acceptance

- Static: lint and typecheck pass, or failures are unrelated and documented with file paths.
- Jest/RNTL: related tests fail before the fix when possible, pass after the fix, and can run without hidden ordering.
- Snapshot: snapshot diff is reviewed and small enough to understand.
- E2E: target app builds or installs, test drives real UI, and the final assertion proves the user-visible outcome.
