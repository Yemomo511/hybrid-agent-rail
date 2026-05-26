# Static Analysis, Unit Tests, And Mocking

## Core Concepts

- Static analysis runs without executing app code. Use it for syntax, style, type contracts, and dead-code signals.
- Unit tests cover the smallest meaningful unit: pure function, class, reducer, formatter, adapter, or narrowly isolated hook.
- Mocking replaces dependencies that make tests slow, unstable, native-only, external, or non-deterministic.
- Prefer real objects when they are cheap and deterministic; mock network, time, storage, device APIs and Native Modules.

## Good Test Cases

- Use Arrange/Act/Assert:
  - Arrange inputs and mocks.
  - Act once on the unit under test.
  - Assert the observable result.
- Test edge cases around nullability, platform branches, date/time, error objects, empty arrays, permission denial, and serialization.
- Keep mocks local to the test unless many tests need the same native shim.
- Reset mocks in `beforeEach` when they hold calls or mutable return values.

```ts
import {colorForDueDate} from '../colorForDueDate';

describe('colorForDueDate', () => {
  it('given a past date, returns red', () => {
    expect(colorForDueDate('2000-10-20')).toBe('red');
  });
});
```

## Using RN Tools

1. Inspect `package.json` first:
   - Use existing `lint`, `typecheck`, `test`, `test:unit`, or `jest` scripts.
   - Follow the existing package manager lockfile.
2. Inspect Jest config:
   - RN `0.85+`: prefer `preset: '@react-native/jest-preset'`.
   - Older RN projects may still use `preset: 'react-native'`; do not migrate unless the task requires it.
3. Typical Jest config:

```js
module.exports = {
  preset: '@react-native/jest-preset',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
};
```

4. Mock Native Modules through Jest when the JS unit cannot load platform code:

```ts
import {NativeModules} from 'react-native';

NativeModules.DeviceSettings = {
  getLocale: jest.fn(() => 'en-US'),
};
```

5. Mock external services at the module boundary:

```ts
jest.mock('../weatherService', () => ({
  getWeather: jest.fn(),
}));
```

## Missing Tools

- No Jest dependency: add Jest and the RN preset matching the RN version; include Babel/Jest transformer only if the project template does not already provide it.
- No lint script but ESLint exists: add a script that follows existing source globs.
- No TypeScript setup: do not introduce TS just for testing; if TS files already exist, add a typecheck script using the existing `tsconfig.json`.
- Watchman or pnpm/ESM transform failures: fix app-local Jest config first, such as `--watchman=false` or `transformIgnorePatterns` for pnpm layout, before changing production code.

## Acceptance

- Run the narrowest related test command first.
- For bug fixes, prefer red-green: prove the new test fails on the bug when feasible, then make it pass.
- Record unrelated lint/type/test failures separately with exact command output and file paths.
