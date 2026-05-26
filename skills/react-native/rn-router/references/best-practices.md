# Best Practices

## Scenario 1: New Expo Universal App

Use Expo Router.

Structure:

```text
src/app/_layout.tsx          -> providers + Root Stack
src/app/(tabs)/_layout.tsx   -> Tabs
src/app/(tabs)/index.tsx     -> home
src/app/(tabs)/settings.tsx  -> settings
src/app/details/[id].tsx     -> detail stack page
src/components/              -> non-route UI
```

Rules:

- Root Stack hides `(tabs)` header.
- Tabs define order/icon/title explicitly.
- Detail pages live outside `(tabs)` when they should push over tabs.
- Validate native deep link and Web refresh for `/details/:id`.

## Scenario 2: Expo Mobile App With Native Tabs

Use Expo Router + platform tabs.

Structure:

```text
src/app/_layout.tsx
src/components/app-tabs.native.tsx -> NativeTabs
src/components/app-tabs.tsx        -> expo-router/ui custom tabs
```

Rules:

- Native platforms use `NativeTabs` for system behavior.
- Web uses custom headless tabs for layout control.
- Keep identical hrefs/names across native and Web.
- Do not put `app-tabs.*` under `src/app`; it is not a route.

## Scenario 3: Existing Community CLI App

Use React Navigation.

Structure:

```text
src/navigation/RootNavigator.tsx
src/navigation/MainTabs.tsx
src/navigation/HomeStack.tsx
src/screens/
```

Rules:

- New RN 7 work defaults to static config.
- Existing RN 5/6 dynamic tree stays dynamic unless migration is explicit.
- Prefer `native-stack` for normal mobile stack; use JS stack only for heavy custom transition/header.
- Deep link config maps business route names to URL paths.

## Scenario 4: Admin / Tablet / Content App

Choose by platform goal:

- Expo universal + URL-first: Expo Router `Drawer` or Web custom sidebar.
- RN mobile only + heavy state control: React Navigation Drawer.

Rules:

- Drawer is for low-frequency global sections, not primary high-frequency mobile tasks.
- On mobile, combine Drawer with inner Stack; on tablet/Web, consider sidebar/tab placement.
- Validate drawer gesture, header toggle, Android back, and Web history.

## Scenario 5: Auth Flow

Use route groups or separate navigators.

Expo Router:

```text
src/app/(auth)/login.tsx
src/app/(app)/(tabs)/index.tsx
src/app/_layout.tsx -> auth gate + Stack
```

React Navigation:

```text
RootStack
  AuthStack
  MainTabs
```

Rules:

- Login success should `replace`, not `push`, to avoid back returning to login.
- Keep auth guard in layout/root navigator, not scattered in every page.
- Preserve intended redirect path when deep link opens a protected page.

## Scenario 6: Migration From React Navigation To Expo Router

Use incremental migration.

Steps:

1. Freeze current route names, params, linking, analytics names, back behavior.
2. Split screen components from navigator registration.
3. Create `src/app` and migrate one stable stack first.
4. Convert route names to paths and `route.params` to search params.
5. Replace container-level tracking with pathname/segments tracking.
6. Validate cold start deep link, tab history, Android back, iOS swipe back, Web refresh.

## Scenario 7: Complex Custom Navigator

Use React Navigation unless the project is already Expo Router and the custom navigator can be adapted cleanly.

Rules:

- Custom router/state/ref APIs are React Navigation territory.
- In Expo Router, adapt compatible navigators through layout boundaries; do not create a second root container.
- If the navigator owns business-critical state, avoid full migration in the same PR.
