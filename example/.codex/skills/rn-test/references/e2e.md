# End-To-End Tests

## Core Concepts

- E2E tests run the app on a simulator, emulator, or device and drive the real UI from the user perspective.
- They provide the highest confidence for critical flows, but are slower, costlier, and more flaky than Jest tests.
- E2E should not inspect React props, Redux stores, hooks, or private app internals. It should locate UI elements, interact, and assert screen outcomes.

## Tool Choice

| Tool | Prefer When | Tradeoff |
| --- | --- | --- |
| Detox | RN app needs deep simulator/emulator automation and the project can maintain native build config | Strong RN fit, more setup |
| Maestro | Team wants fast YAML flows and black-box mobile UI checks | Easy adoption, less RN-specific control |
| Appium | Cross-platform QA infra already uses WebDriver or needs broad device farm support | Flexible, heavier setup |

Use the tool already present in the repo unless it is clearly broken or out of scope for the requested flow.

## Good Test Cases

- Cover vital paths only: auth, onboarding, purchase, permission, native SDK integration, core navigation and irreversible actions.
- Give stable selectors to critical controls when accessibility text is not enough.
- Reset app state explicitly through supported app hooks, launch args, test accounts, deep links, or backend fixtures.
- Assert a user-visible final state such as a screen title, success message, disabled button, persisted item, or error banner.

## Using RN Tools

- For Detox, inspect `.detoxrc.*`, `e2e/`, native build variants and package scripts before adding config.
- For Maestro, inspect `.maestro/` or `maestro/` flows and app id before writing YAML.
- For Appium, inspect WebDriver config, device capabilities and CI service integration before changing selectors.
- For all E2E tools, run or document the exact platform build command separately from the test command when setup is uncertain.

## Detox Pattern

```ts
describe('Login flow', () => {
  beforeAll(async () => {
    await device.launchApp({newInstance: true});
  });

  it('logs in successfully', async () => {
    await element(by.id('email-input')).typeText('user@example.com');
    await element(by.id('password-input')).typeText('password123');
    await element(by.id('login-button')).tap();

    await expect(element(by.text('Home'))).toBeVisible();
  });
});
```

## Maestro Pattern

```yaml
appId: com.example.app
---
- launchApp
- tapOn:
    id: email-input
- inputText: user@example.com
- tapOn:
    id: password-input
- inputText: password123
- tapOn:
    id: login-button
- assertVisible: Home
```

## Missing Tools

- Existing Detox/Appium/Maestro config: use it and avoid introducing another E2E stack.
- No E2E tool and the flow is simple black-box UI: recommend Maestro for fastest setup.
- No E2E tool and the app needs RN-specific synchronization or native build control: recommend Detox.
- CI/device unavailable: still add the test only when requested, then report the exact unverified command and blocker.
- Build fails before test starts: treat native build as the blocker; do not mark E2E as failed app behavior.

## Acceptance

- The app builds or installs for the target platform.
- The E2E runner launches the target build and performs real UI actions.
- The test ends with a user-visible assertion.
- If local execution is blocked, the final report includes command attempted, device/simulator state, error text, and next recovery command.
