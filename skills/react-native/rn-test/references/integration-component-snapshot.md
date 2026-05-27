# Integration, Component, And Snapshot Tests

## Core Concepts

- Integration tests combine real app modules and verify that their cooperation works.
- Component tests run in Node.js and verify React Native render output and user interaction; they do not prove native Android/iOS backing code.
- Snapshot tests store render output for regression detection. They guard against unexpected tree changes but do not prove behavior is correct.

## Good Test Cases

- Test what the user sees or hears: rendered text, accessibility label, role, placeholder, value, loading state, error state and navigation outcome.
- Prefer `getByText`, `getByPlaceholderText`, `getByLabelText`, `getByRole`, `findBy*`, and `queryBy*`.
- Use `testID` only when there is no user-visible or accessibility-friendly selector.
- Avoid assertions on component props, internal state, private callbacks, or implementation-only event handlers.
- For async UI, use `findBy*` or `waitFor` instead of arbitrary sleeps.

```tsx
import {fireEvent, render, screen} from '@testing-library/react-native';
import {GroceryShoppingList} from '../GroceryShoppingList';

test('given an empty list, user can add an item', () => {
  render(<GroceryShoppingList />);

  fireEvent.changeText(
    screen.getByPlaceholderText('Enter grocery item'),
    'banana',
  );
  fireEvent.press(screen.getByText('Add the item to list'));

  expect(screen.getAllByText('banana')).toHaveLength(1);
});
```

## Integration Pattern

- Keep network, native-only, clock and storage seams mocked; keep app code such as reducer, selector, hook, mapper and component real.
- Assert the final observable state instead of every internal call.

```tsx
import {render, screen} from '@testing-library/react-native';
import {UserName} from '../UserName';
import {fetchUser} from '../userService';

jest.mock('../userService');

test('loads and renders user name', async () => {
  jest.mocked(fetchUser).mockResolvedValue({name: 'Alice'});

  render(<UserName />);

  expect(screen.getByText('Loading')).toBeTruthy();
  expect(await screen.findByText('Alice')).toBeTruthy();
});
```

## Using RN Tools

- Use React Native Testing Library for new component tests because it provides RN-friendly render, query and event APIs.
- Use Jest as the runner unless the project already has a different supported runner wired into RN.
- Put shared native mocks in `jest.setup.*` only when several tests need them; otherwise keep mocks near the test.
- Use `fireEvent` for simple RN events and higher-level helpers only if the project already uses them.

## Snapshot Pattern

- Snapshot only small, stable components with meaningful review value.
- Never update snapshots blindly. Inspect whether the changed output is intended.
- Prefer explicit assertions for behavior, state changes, and error messages.

```tsx
import {render} from '@testing-library/react-native';
import {Title} from '../Title';

test('renders title consistently', () => {
  expect(render(<Title>Welcome</Title>).toJSON()).toMatchSnapshot();
});
```

## Missing Tools

- No React Native Testing Library: add `@testing-library/react-native` and configure Jest setup only if the target tests need custom matchers or global mocks.
- React Test Renderer only: treat direct renderer usage as legacy/low-level; prefer RNTL for new user-facing tests.
- Missing native mocks: add the smallest `jest.mock(...)` or `jest.setup.*` shim needed to make the component render.
- Expo project: inspect whether `jest-expo` already owns the preset before replacing config.

## Acceptance

- Component tests prove visible output before and after user interaction.
- Integration tests exercise at least two real app modules and mock only hard external boundaries.
- Snapshot diffs are small, committed intentionally, and accompanied by explicit behavior assertions when behavior matters.
