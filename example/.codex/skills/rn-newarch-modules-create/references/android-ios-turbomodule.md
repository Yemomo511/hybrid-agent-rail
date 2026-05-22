# Android And iOS TurboModule Reference

## Core Shape

Android/iOS 平台 TurboModule 的稳定顺序：

1. 声明 JS typed spec。
2. 配置 `codegenConfig`，让 Codegen 找到 spec。
3. Android/iOS 分别实现 generated interface/protocol。
4. 注册模块 provider/package。
5. 运行 Android Gradle Codegen 和 iOS Pods Codegen。

## JavaScript Spec

推荐文件名以 `Native` 开头，例如 `specs/NativeLocalStorage.ts` 或 `src/specs/NativeDeviceInfo.ts`。

```ts
import type {TurboModule} from 'react-native';
import {TurboModuleRegistry} from 'react-native';

export interface Spec extends TurboModule {
  getItem(key: string): string | null;
  setItem(value: string, key: string): void;
}

export default TurboModuleRegistry.getEnforcing<Spec>('NativeLocalStorage');
```

可选模块使用 `TurboModuleRegistry.get<Spec>()`，强依赖模块使用 `getEnforcing<Spec>()`。

## Codegen Config

App 内模块的最小配置通常在根 `package.json`：

```json
{
  "codegenConfig": {
    "name": "NativeLocalStorageSpec",
    "type": "modules",
    "jsSrcsDir": "specs",
    "android": {
      "javaPackageName": "com.nativelocalstorage"
    }
  }
}
```

Library 模块通常把 `jsSrcsDir` 指向包内 `src`/`specs`，并确保 example app 能通过 autolinking 发现该 package。

## Android Implementation

Android 实现要继承 generated `NativeXxxSpec`，并提供稳定的 `NAME`。

```kotlin
class NativeLocalStorageModule(
  reactContext: ReactApplicationContext,
) : NativeLocalStorageSpec(reactContext) {
  override fun getName() = NAME

  override fun getItem(key: String): String? {
    return reactApplicationContext
      .getSharedPreferences("native_local_storage", Context.MODE_PRIVATE)
      .getString(key, null)
  }

  companion object {
    const val NAME = "NativeLocalStorage"
  }
}
```

注册使用 `BaseReactPackage`，并在 `ReactModuleInfo` 中设置 `isTurboModule=true`。

```kotlin
class NativeLocalStoragePackage : BaseReactPackage() {
  override fun getModule(name: String, reactContext: ReactApplicationContext): NativeModule? {
    return if (name == NativeLocalStorageModule.NAME) NativeLocalStorageModule(reactContext) else null
  }

  override fun getReactModuleInfoProvider() = ReactModuleInfoProvider {
    mapOf(
      NativeLocalStorageModule.NAME to ReactModuleInfo(
        NativeLocalStorageModule.NAME,
        NativeLocalStorageModule.NAME,
        false,
        false,
        false,
        true,
      ),
    )
  }
}
```

验证命令：

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema
./gradlew assembleDebug
```

## iOS Implementation

iOS 实现要对齐 generated spec/protocol。Objective-C++ 或 C++ 依赖场景使用 `.mm`。

常见平台模块要点：

- 模块名必须和 JS spec 中 `TurboModuleRegistry` 使用的名字一致。
- provider 要把模块名映射到模块实例。
- `pod install` 会触发 RN Codegen script phase 并生成 iOS 侧接口。
- 如果模块来自 npm library，确认 podspec 和 autolinking 能让 app 发现它。

验证命令：

```bash
cd ios
bundle exec pod install
xcodebuild -workspace MyApp.xcworkspace -scheme MyApp -configuration Debug build
```

## Compatibility Notes

- 需要同时支持 New Architecture 和 Legacy Architecture 时，不要自行拼旧桥和新架构模板；读取 backward compatibility guide。
- RN 0.76+ 新模块优先 TurboModule。只有明确历史依赖、旧宿主或分阶段迁移要求时保留旧桥兼容。
- Android 新增 Gradle 配置时，本仓库跨端规范优先使用 `.kts`。
