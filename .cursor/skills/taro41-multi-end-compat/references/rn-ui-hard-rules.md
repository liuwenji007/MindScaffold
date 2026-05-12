# RN UI Hard Rules (Mandatory)

Apply these rules as hard constraints for Taro 3.x / 4.x (pre-Taro 5) code targeting Android, iOS, and HarmonyOS hybrid runtimes. Pages and components may be **JSX or TSX** depending on the project; examples use `Text` / `View` markup regardless of file extension.

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

### Multiple `Text` nodes and wrapper `View`

- When **two or more `Text` nodes are direct siblings** under the same parent, wrap them in an outer **`View`** with a **`className`**. Use that wrapper class for **layout** (for example row/column, spacing, alignment). Keep **typography** (`color`, `fontSize`, etc.) on each `Text` or its own text class, not only on the wrapper.
- When one `Text` sits beside **non-text** siblings (icon, image, button), wrap that `Text` in a **`View`** with **`className`** when the design needs stable layout or RN-safe grouping; do not rely on loose sibling `Text` + `View` mixing without explicit structure.

### Icon and SVG wrapper `View`

- By default wrap **icon components** and **SVG** in an outer **`View`** with **`className`**. Use the wrapper for **layout** (alignment in flex rows, spacing, consistent box for RN).
- Prefer **margin / flex alignment / fixed box size** on the wrapper when they affect how the icon sits next to `Text` or other siblings; keep icon-specific props (name, source, color prop) on the inner node when the component API requires it.

### Sole `Text` participating in flex layout

- When a block contains **only** a `Text` node but that block **participates in parent flex layout** (for example a row item with `flex: 1`, shrink, baseline or cross-axis alignment with siblings), wrap the `Text` in a **`View`** with **`className`** and set **`display: flex`** on that wrapper in `*.rn.scss`.
- Set **`flex-direction`** on the wrapper when needed (often `column` for a single line of copy inside the flex item). RN-side flex sizing and alignment for text-only children is more reliable with an explicit flex container than a bare `Text` as the flex item.

### Text typography audit (missing styles on `Text`)

- On RN, **`Text` does not inherit** `color`, `fontSize`, `lineHeight`, `fontWeight`, `textAlign`, `letterSpacing`, etc. from a parent `View`. Web cascade or parent `View` classes are not a substitute.
- When you see a `Text` with **no typographic styling** (no `className` bound to text rules in `*.rn.scss`, and no `style` / props that set typography), decide whether RN compatibility needs an explicit fix:
  - **Fix required**: Copy must match design (non-default color, size, weight, alignment).
  - **Fix required**: A parent `View` or sibling `View` carries text-related appearance that was intended for this string (for example parent has `color` / `font-size` on a wrapper in SCSS but `Text` is bare).
  - **Fix required**: This `Text` is **not** the only child of its parent `View` (it has icon/sibling nodes). Treat typography as belonging on `Text` only.
  - **Default-only OK (rare)**: Sole `Text` child and product explicitly accepts platform default system font and label color for that string; if you skip a class, leave a short comment so the next edit does not "fix" it back by accident.
- When a fix is required, add a **`className` on `Text`** and define **`color`, `fontSize`, `lineHeight`, `fontWeight`, `textAlign`** (and any other needed text rules) in that Text's own rule in `*.rn.scss`. **Pull values from design or from the wrapper you are replacing**; do not leave appearance implied by parent `View` alone.
- For shared pages or components (JSX or TSX) used on H5 and RN, prefer **every visible `Text` to have a dedicated text class** on RN paths so H5 and RN stay aligned and reviews do not miss bare `Text` nodes.

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
