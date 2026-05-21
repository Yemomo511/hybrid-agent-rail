---
name: hybrid-written-plan
description: Supplement superpowers:writing-plans for cross-platform app, SDK, React Native, Flutter, Lynx, or hybrid bridge requirements. Use when drafting or reviewing an implementation plan that may involve native Android/iOS changes, generated bridge contracts, native modules, platform views, events/callbacks, or build/runtime integration decisions.
---

# Hybrid Written Plan

## Overview

Use this skill together with the upstream `superpowers:writing-plans` skill. Keep its plan structure, task granularity, TDD expectations, exact paths, commands, and handoff flow; add the cross-platform native impact and bridge-form decisions below before decomposing tasks.

## Planning Addendum

Before writing implementation tasks, add a concise `Hybrid Native Impact` section to the plan. It must answer:

1. Whether the requirement is JS/Dart-only, generated-contract-only, native-only, or mixed.
2. Which platforms are affected: Android, iOS, or both.
3. Whether existing bridge contracts are reused, extended, or replaced.
4. Which bridge form will be used and why.
5. Which native build, runtime, and device/simulator checks prove the plan works.

If any answer is unknown, mark it as an explicit open question and do not hide it inside implementation steps.

## Native Impact Checklist

Classify the requirement by checking these surfaces:

- Product API surface: JS/TS, Dart, generated Spec, public package export, or app-only call site.
- Native implementation surface: Kotlin/Java, Swift/Objective-C, Gradle, CocoaPods, Xcode project, Android Manifest, Info.plist, permissions, lifecycle hooks, or SDK initialization.
- Runtime transport surface: synchronous method, asynchronous method, callback, event stream, native view, platform view, binary/file transport, or generated model conversion.
- Compatibility surface: old architecture vs new architecture, generated code regeneration, app host version, platform feature availability, and existing bridge consumers.

## Bridge Decision Guide

Choose the narrowest bridge form that matches the requirement:

- React Native old bridge `NativeModules`: imperative app/package APIs that can remain asynchronous and do not require New Architecture typing.
- React Native `RCTEventEmitter` / event emitter: native-to-JS ongoing events, observer callbacks, stream status, or lifecycle notifications.
- React Native TurboModule: typed New Architecture methods, generated Spec ownership, or performance-sensitive package APIs.
- React Native Fabric/native component: native UI rendering, embedded SDK views, gestures, or view lifecycle ownership.
- Flutter `MethodChannel`: request/response APIs initiated from Dart.
- Flutter `EventChannel`: native-to-Dart event streams, observers, playback state, or long-lived status updates.
- Flutter `PlatformView`: native UI embedded in Flutter, camera/player/map-like SDK views, or view lifecycle handoff.
- Generated bridge/codegen path: repeated multi-platform API contracts, model conversion, or when the repo already treats bridge definitions as source of truth.
- Native-only path: build configuration, permissions, SDK setup, platform lifecycle, or bugs that do not need a public cross-platform API change.

Prefer an existing repo bridge style when it already covers the behavior. Only introduce a new bridge form when the existing one cannot express the required lifecycle, type contract, performance, or UI ownership.

## Task Requirements

Every affected platform task must include:

- Exact files to create or modify on the cross-platform side and native side.
- A red test or reproducible failing check before implementation when feasible.
- Regeneration commands when generated bridge files are part of the source of truth.
- Platform validation commands, with expected results, for the smallest meaningful gate.
- Documentation update steps when the bridge contract, native setup, or public usage changes.

Do not let a single task mix unrelated platform ownership. Split Android, iOS, generated contract, and app call-site work when they can be verified independently.

## Good Example

```markdown
## Hybrid Native Impact

- Scope: mixed JS + native view work.
- Platforms: Android and iOS.
- Bridge form: React Native Fabric/native component for rendering the SDK view, plus event emitter for playback state callbacks. `NativeModules` alone is insufficient because the SDK owns a visible native view lifecycle.
- Contract source: extend the existing generated view Spec and keep JS props/events as the public API.
- Verification: generated Spec test, Android debug build, iOS simulator build, and one app smoke check that mounts the view and receives the ready event.
- Open questions: confirm whether the SDK requires extra Android permissions or iOS Info.plist keys.
```
