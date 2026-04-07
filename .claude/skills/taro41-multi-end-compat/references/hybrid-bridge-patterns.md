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

