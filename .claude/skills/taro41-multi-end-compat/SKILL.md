# taro41-multi-end-compat

> Build and refactor Taro 3.x / 4.x (pre-Taro 5) projects for one-codebase multi-end compatibility across Android, iOS, and HarmonyOS hybrid containers. Use when requests involve cross-platform runtime differences, JSBridge adaptation, webview/hybrid integration, style and layout inconsistencies, native capability fallback, build config divergence, or platform-specific debugging—not limited to a single minor (e.g. 4.1); match your repo's Taro major/minor and official migration notes when upgrading.

- **Compatibility:** Taro 3.x / 4.x (pre-Taro 5), React Native, HarmonyOS Hybrid
- **Version:** 1.0.0
- **Author:** HandsomeLiu
- **Impact:** high
- **Tags:** taro, cross-platform, react-native, harmonyos, hybrid, jsbridge, android, ios

# Taro Pre-5 Multi-End Compatibility

Use this skill to implement and troubleshoot one-codebase multi-end behavior for Android, iOS, and HarmonyOS hybrid apps on **Taro 5 之前**的常见版本（如 **3.x、4.x**）。不限定于某一小节版本（例如仅 4.1）；具体 API、插件与构建配置以项目锁定的 Taro 版本为准。**升级到 Taro 5+** 时请以官方迁移文档为准，本 skill 中的多端兼容思路仍可沿用。

## Version scope

- **适用**：单仓多端（H5 / 小程序 / RN 等）在 **Taro 5 以下** 的工程实践与排障。
- **注意**：不同大版本之间存在差异；遇到与版本强相关的行为，先对照当前 Taro 主版本文档再改代码。

## Workflow

1. Identify target runtime matrix:
   - Android hybrid container type and minimum OS version.
   - iOS WKWebView container type and minimum iOS version.
   - HarmonyOS hybrid container implementation and JSBridge injection mode.
2. Check entry and build settings in Taro:
   - Confirm `config/index` and per-end config differences.
   - Verify feature flags for environment-based compatibility branches.
3. Classify the issue:
   - UI/layout, navigation lifecycle, storage/cookie/session, network, media/file, permissions, bridge calls.
4. Implement compatibility by priority:
   - Prefer capability detection, then graceful fallback, and keep platform branching centralized.
5. Validate with a fixed test checklist for all three ends before completion.

## Coding Rules

- Keep platform divergence isolated in `src/platform/` or `src/utils/platform-*`.
- Avoid scattering `if (isAndroid)` or `if (isIOS)` across business pages.
- Use runtime capability detection before UA matching whenever possible.
- Normalize bridge response shape into one internal contract.
- Provide fallback for every native/hybrid call path.
- Keep timeout/retry policy consistent across platforms.
- Treat `references/rn-ui-hard-rules.md` as mandatory when writing RN-facing page code or styles.

## Recommended Structure

- `src/platform/runtime.ts`: runtime and capability detection.
- `src/platform/bridge.ts`: unified JSBridge invocation.
- `src/platform/storage.ts`: cookie/storage/session abstraction.
- `src/platform/media.ts`: camera/file/upload/download abstraction.
- `src/platform/compat-flags.ts`: switch table for temporary platform patches.

## Read References

- Read `references/platform-compat-checklist.md` before implementing.
- Read `references/hybrid-bridge-patterns.md` when touching bridge, auth token sync, or native interaction.
- Read `references/rn-ui-hard-rules.md` when touching list, tab, view/text, or style declarations for RN compatibility.

## Delivery Checklist

- Confirm Android, iOS, and HarmonyOS each pass smoke tests.
- Confirm no uncaught Promise rejection in bridge calls.
- Confirm fallback path works when bridge is unavailable.
- Confirm UI key pages render without layout break.
- Confirm route transitions and back behavior are consistent.

---

## 参考: rn-ui-hard-rules.md

# RN UI Hard Rules (Mandatory)

Apply these rules as hard constraints for Taro 3.x / 4.x (pre-Taro 5) code targeting Android, iOS, and HarmonyOS hybrid runtimes.

## 1) List Tab Switch Behavior

- When switching list tabs, always clear current list data and reset pagination state.
- Show loading state immediately on tab switch until the new tab data is returned.
- Avoid carrying previous tab list content into next-tab render.

## 2) Selector Compatibility

- RN side may fail to parse combined selectors like `.my-parking-renew-submit.next`.
- Use single explicit class selectors instead, for example:
  - Use `.my-parking-renew-submit-next`
  - Do not rely on `.a.b` combined selector semantics.

## 3) View/Text Handling

- Never place raw text directly inside `View`.
- Wrap all visible text content with `Text`.
- In compatibility tests, keep `className` on relevant `Text` nodes for assertion and styling stability.
- Declare text styles in their own text class. Do not rely on parent `View` text inheritance.

## 4) Numeric Style Values

- Use numeric values for `borderRadius` in RN-compatible style declarations.
- Do not use px strings for `borderRadius` (for example, avoid `'8px'`).

## 5) Full-Row Layout Rule

- For elements designed to occupy a full row, if `padding` or outer margin is applied, set width to `auto`.
- Avoid fixed `width: 100%` with additional horizontal spacing that can cause layout overflow on RN containers.

## 6) Flex Direction Default Rule

- RN default layout direction is vertical (`column`).
- Keep default behavior for vertical sections; no need to force `column` everywhere.
- Set `flexDirection: 'row'` only when the design clearly requires horizontal arrangement.
- For key horizontal containers, always declare `row` explicitly to avoid ambiguity.

## 7) Unit Conversion Rule (Global 1:1)

- Use strict 1:1 values for RN-compatible style output because Taro handles platform adaptation.
- If design or source style uses `rpx`, write `px` with the same number in RN-facing implementation.
- Treat related size values as 1:1 by default in this project (for example: `width`, `height`, `padding`, `margin`, `fontSize`, `lineHeight`, `borderRadius`).
- Do not add manual scaling factors unless a project-level override explicitly requires it.

## 8) Gradient and Shadow Handling

- Do not rely on raw style declarations for RN visual effects such as CSS `linear-gradient` and `box-shadow`.
- Prefer existing shared components in this project before creating new compatibility wrappers:
  - `@/components/linear-gradient`
  - `@/components/gradient`
  - `@/components/box-shadow`
- If an effect cannot be reproduced 1:1 on RN, keep the layout stable and degrade visual effect first.

## 9) Sticky/Fixed Compatibility

- RN does not support CSS behavior equivalent to `position: sticky` or web-style `position: fixed` in `.scss`.
- Replace these patterns with `position: absolute` in RN-compatible implementation and adjust parent layout accordingly.
- Reserve explicit space in normal flow (placeholder or container padding/margin) to avoid overlap when converting sticky/fixed blocks.
- Keep z-index layering explicit for absolute-positioned headers, footers, or floating actions.

## 参考: platform-compat-checklist.md

# Platform Compatibility Checklist (Taro pre-5: 3.x / 4.x, etc.)

## 1) Runtime Identification

- Record container versions for Android, iOS, HarmonyOS.
- Confirm WebView engine and JSBridge readiness timing.
- Detect capabilities at runtime:
  - `hasBridge`
  - `hasNativeStorageSync`
  - `hasNativeShare`
  - `hasNativeUpload`

## 2) UI and Layout

- Validate safe area handling and status bar offset.
- Validate viewport and keyboard resize behavior.
- Check font rendering differences and line-height clipping.
- Check sticky/fixed positioning in long scroll pages.

## 3) Navigation and Lifecycle

- Verify page lifecycle consistency (show/hide/unload).
- Verify back gesture and hardware back handling.
- Verify deep link routing and parameter decoding.

## 4) Auth, Storage, and Session

- Verify token sync between H5 and native container.
- Verify cookie availability under each container policy.
- Verify storage key namespace consistency.
- Verify logout clears all caches on each platform.

## 5) Network Behavior

- Verify timeout defaults and retry policy.
- Verify TLS/certificate handling constraints by container.
- Verify upload/download progress callback consistency.

## 6) Media and File

- Verify camera/gallery permission request behavior.
- Verify temp file path conversion and MIME type mapping.
- Verify large file upload chunk policy and cancel behavior.

## 7) Bridge and Native Invocation

- Verify bridge ready event ordering.
- Verify error code normalization and fallback return shape.
- Verify unavailable method fallback does not block main flow.

## 8) Release Gate

- Run smoke test list for all three platforms.
- Compare error logs and promise rejection counts.
- Keep a temporary compatibility flag for risky patches.

## 参考: hybrid-bridge-patterns.md

# Hybrid Bridge Patterns

## Unified Bridge Contract

Use one internal response model:

- success: `boolean`
- code: `string`
- message: `string`
- data: `unknown`
- requestId: `string`

Always map native platform responses to this model.

## Safe Invoke Pattern

1. Check bridge availability.
2. Wait for bridge-ready signal with timeout.
3. Invoke method with requestId.
4. Normalize response.
5. Fallback to H5 alternative when bridge fails.

## Token Sync Pattern

- Source of truth should be app-side secure storage.
- On page show, pull latest token from bridge if available.
- On token refresh, sync both H5 and native store.
- On logout, clear both stores and notify native layer.

## Recommended Error Mapping

- Timeout -> `BRIDGE_TIMEOUT`
- Method missing -> `BRIDGE_METHOD_UNAVAILABLE`
- Permission denied -> `NATIVE_PERMISSION_DENIED`
- Native internal error -> `NATIVE_INTERNAL_ERROR`
- Unknown -> `BRIDGE_UNKNOWN_ERROR`

## Fallback Strategy

- Read-only action: fallback to H5 cache or local API.
- Write action: queue and retry after bridge recovery.
- Critical action: show blocking error with retry button.

## Logging Guidance

- Log minimal metadata: platform, method, duration, code.
- Never log plaintext token or personal data.
- Tag logs with `requestId` for traceability.

