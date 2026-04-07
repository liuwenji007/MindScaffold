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

