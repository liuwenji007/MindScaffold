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
