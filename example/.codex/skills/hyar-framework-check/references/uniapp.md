# uni-app Official Notes

## Sources

- uni-app introduction: https://uniapp.dcloud.net.cn/tutorial/uni-publish/first.html
- uni-app composition and cross-platform principles: https://uniapp.dcloud.net.cn/tutorial/index.html

## Official Positioning

- uni-app is a Vue.js-based framework where developers write one codebase that can be published to iOS, Android, HarmonyOS Next, Web, many Mini Program platforms, quick apps, and HarmonyOS services.
- uni-app code mainly uses JS, Vue, and CSS, with TS and preprocessors also supported.
- App-side development can use nvue for native rendering and uts that compiles to Kotlin and Swift.
- uni-app achieves multi-end execution through compiler output plus platform runtimes; each platform has its own runtime.
- The compiler supports conditional compilation, allowing shared and platform-specific code in one project.
- uni-app runtime provides common cross-platform APIs while still allowing platform-specific APIs where needed.

## Prefer uni-app When

- The team is strongest in Vue, JS, H5, or Mini Program development.
- The product must cover Web, many Mini Program platforms, App, and possibly HarmonyOS with one delivery-oriented project.
- Speed, channel coverage, plugin ecosystem, and low learning cost matter more than absolute native UI fidelity.
- Platform-specific behavior can be handled with conditional compilation, uni APIs, plus APIs, uts, or native plugins.

## Be Careful When

- The product is a high-performance native-heavy App with complex custom rendering, low-level media, AR, or deep SDK work.
- The team expects all web DOM/Vue UI libraries to run unchanged across App and Mini Program targets.
- App package size, runtime behavior, or native SDK customization has strict limits.
- The target is only Android+iOS App and the team has stronger React/Kotlin/Flutter expertise than Vue/Mini Program expertise.

## Decision Signals

- Strong signal for uni-app: “Vue team”, “Mini Program first”, “many channels”, “fast delivery”, “H5+App+Mini Program”.
- Weak signal for uni-app: “extreme native performance”, “complex native SDK UI”, “pixel-level custom rendering”.
