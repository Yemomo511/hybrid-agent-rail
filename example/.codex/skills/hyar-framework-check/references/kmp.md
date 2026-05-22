# KMP Official Notes

## Sources

- Kotlin Multiplatform overview: https://kotlinlang.org/docs/multiplatform/kmp-overview.html
- Kotlin Multiplatform official site: https://kotlinlang.org/multiplatform/

## Official Positioning

- KMP enables sharing code across Android, iOS, desktop, web, and server while retaining native development advantages.
- Compose Multiplatform can share UI code, but KMP itself focuses on code reuse and does not require replacing native UI.
- KMP supports gradual adoption: share a single module, expand to shared business logic, or share both logic and UI with Compose Multiplatform.
- KMP emphasizes native performance through Kotlin/Native and direct access to platform APIs, especially where a VM is undesirable.
- Official materials position KMP as useful when UX precision, platform fidelity, and native integration remain important.

## Prefer KMP When

- The team has Kotlin/Android strength and wants to reuse existing Kotlin architecture, data models, validation, networking, storage, or business logic.
- The product wants Android and iOS consistency but still values SwiftUI/UIKit or native platform UI.
- The app already exists natively and needs gradual cross-platform adoption instead of a full rewrite.
- Direct platform API access, native performance, or native-team ownership matters.
- The project can tolerate KMP/iOS integration and Kotlin/Swift interop work.

## Be Careful When

- Mini Program, many web variants, or low-cost full-channel distribution is a first-class target.
- The team has no Kotlin/Android experience and no native mobile foundation.
- The desired output is a single UI codebase with minimal platform-specific thinking and the team is more comfortable with Dart or JS.

## Decision Signals

- Strong signal for KMP: “keep native UI”, “share only core logic”, “existing Android codebase”, “native app migration”, “platform fidelity”.
- Weak signal for KMP: “one codebase for App + many mini programs”, “no native team”, “fastest beginner path”.
