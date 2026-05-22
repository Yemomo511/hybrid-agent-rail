# C++ TurboModule Reference

## When To Use C++

选择纯 C++ TurboModule 的典型场景：

- Android/iOS 共享同一套业务逻辑或已有 C++ SDK。
- 模块需要较高性能、复杂数据处理或跨平台一致行为。
- 平台层只负责注册和少量桥接，核心实现不依赖 Java/Kotlin/Objective-C/Swift API。

不要为了普通系统 API 包装强行引入 C++；Android/iOS 平台实现通常更简单。

## Implementation Shape

纯 C++ TurboModule 仍然从 JS spec 和 Codegen 开始，然后把模块实现放入共享 C++：

1. 创建 `NativeXxx.ts` spec，并配置 `codegenConfig.type = "modules"`。
2. 添加共享 C++ 实现，例如 `shared/NativeXxxModule.{h,cpp}`。
3. Android 通过 CMake 编译共享代码，并在 `OnLoad.cpp` 或等效入口注册 provider。
4. iOS 通过 CocoaPods/Xcode 编译 `.cpp/.mm`，并在 iOS provider 中把模块名映射到 C++ TurboModule。
5. 双端分别构建验证。

## Android Registration

Android 侧重点：

- `CMakeLists.txt` 要包含共享 C++ 源文件和 RN generated code 依赖。
- `OnLoad.cpp` 或等效入口负责暴露 module provider。
- RN 0.76 的 Android native library merging 之后，涉及自定义 C++ 时要核对当前模板和 SoLoader 初始化方式。

验证：

```bash
cd android
./gradlew generateCodegenArtifactsFromSchema
./gradlew assembleDebug
```

## iOS Registration

iOS 侧重点：

- 使用 `.mm` 连接 Objective-C++ 与 C++ 实现。
- provider 要返回 C++ TurboModule 实例，并让模块名与 JS spec 一致。
- RN 0.76 之后不要依赖已移除的 `RCT_EXPORT_CXX_MODULE_EXPERIMENTAL` 自动链接宏。
- podspec 或 Podfile 必须包含共享 C++ 源文件和需要的 compiler flags。

验证：

```bash
cd ios
bundle exec pod install
xcodebuild -workspace MyApp.xcworkspace -scheme MyApp -configuration Debug build
```

## Failure Checks

- JS 能 import spec，但运行时报 module missing：检查 provider/package 是否注册、模块名是否一致、Codegen 是否实际运行。
- Android 链接失败：检查 CMake 源文件、RN 版本的 native library 合并要求、`OnLoad.cpp` 是否进入构建。
- iOS 编译失败：检查 `.m`/`.mm` 后缀、podspec source_files、C++ standard 和 generated header import。
- 双端行为不同：把平台 API 适配留在薄层，核心逻辑放回共享 C++。
