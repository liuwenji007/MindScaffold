# Sprite 资源

## homeBg（`homeBg.png` / `homeBg.webp`）

- **雪碧图**：2560 × 711 px
- **布局**：**单排 8 帧**（每帧 320 × 711）
- **用途**：首页背景循环（壁炉火焰、窗外星星等微动）
- **组件**：`src/components/HomeBgSprite/`
- **分端**：H5 用 `homeBg.webp`，小程序等用 `homeBg.png`（见 `homeBgAsset.ts`）

帧序：从左到右，帧 n 的 x = `n × 320`，y = `0`。

动画：`setInterval` + **整数像素** `background-position`（`frameStep = round(320×scale)`）；`cover` 铺满并 `coverOverscan≈1.08` 裁 AI 帧内黑边；`image-rendering: pixelated` 减抖动。

旧版竖长条备份：`homeBg_bak.png`（2560×1440，勿再引用）。

---

## loading.png

- **雪碧图**：2752 × 1536 px
- **单帧**：688 × 768 px
- **共 7 帧**

### 排布（非规则 4×2 网格）

| 帧 | 行 | 说明 | 左上角 (x, y) |
|----|-----|------|----------------|
| 0–3 | 上排 | 4 帧等宽对齐 | 0, 688, 1376, 2064 × **0** |
| 4–6 | 下排 | 3 帧，相对上排 **水平错开半帧**（落在上一行间隙下方） | 344, 1032, 1720 × **768** |

下排 x = `344 + n × 688`（`344 = 688 / 2`）。

组件内帧表：`LOADING_FRAMES` in `src/components/LoadingSprite/index.tsx`  
若换图后错开量不是半帧，只需改该数组坐标。
