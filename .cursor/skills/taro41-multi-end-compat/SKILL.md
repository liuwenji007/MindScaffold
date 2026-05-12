---
name: taro41-multi-end-compat
description: Build and refactor Taro 3.x / 4.x (pre-Taro 5) projects for one-codebase multi-end compatibility across Android, iOS, and HarmonyOS hybrid containers. Works with JSX or TSX pages/components and JS or TS utilities—adapt paths and extensions to each repo. Use when requests involve cross-platform runtime differences, JSBridge adaptation, webview/hybrid integration, style and layout inconsistencies, native capability fallback, build config divergence, or platform-specific debugging—not limited to a single minor (e.g. 4.1); match your repo's Taro major/minor and official migration notes when upgrading.
---

# Taro Pre-5 Multi-End Compatibility

Use this skill to implement and troubleshoot one-codebase multi-end behavior for Android, iOS, and HarmonyOS hybrid apps on **Taro 5 之前**的常见版本（如 **3.x、4.x**）。不限定于某一小节版本（例如仅 4.1）；具体 API、插件与构建配置以项目锁定的 Taro 版本为准。**升级到 Taro 5+** 时请以官方迁移文档为准，本 skill 中的多端兼容思路仍可沿用。

## Version scope

- **适用**：单仓多端（H5 / 小程序 / RN 等）在 **Taro 5 以下** 的工程实践与排障。
- **注意**：不同大版本之间存在差异；遇到与版本强相关的行为，先对照当前 Taro 主版本文档再改代码。

## Multi-project / language

- Apply this skill across repos that use **JSX (`.jsx`) or TSX (`.tsx`)** for pages and components. Rules refer to React markup; file extension follows each project.
- Shared helpers may be **JavaScript (`.js`) or TypeScript (`.ts`)**. Prefer the conventions and folder layout of the current repository when suggesting paths or file names.

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

---

## 编译时机制

### 环境变量

```js
if (process.env.TARO_ENV === 'h5') {
  // H5-specific code
} else if (process.env.TARO_ENV === 'weapp') {
  // 微信小程序专用
}
```

### 条件编译

```js
// #if h5
console.log('This is H5');
// #endif

// #if weapp
console.log('This is WeChat Mini Program');
// #endif
```

---

## 运行时 API

### 平台判断

```js
import Taro from '@tarojs/taro';
if (Taro.getEnv() === 'h5') { /* H5 logic */ }
```

### 分端入口

Taro 4.x 支持分端页面文件，如 `index.h5.tsx` 和 `index.weapp.tsx`，编译时自动选择。

### 页面/组件的跨端调用

将平台差异封装在工具函数中，通过统一接口调用。

---

## 常见兼容场景与代码示例

### 1. 样式兼容
- **单位**：推荐 `px` 或无单位数值（Taro 自动转换 rpx/rem）。
- **安全区**：`env(safe-area-inset-*)` 适配刘海屏。
- **1px 边框**：伪元素 + transform 或 `hairline` 类。

### 2. 组件兼容
- **View/Text**：统一使用 Taro 组件。
- **富文本**：`RichText` 或 `dangerouslySetInnerHTML`（仅 H5）。
- **自定义导航栏**：区分小程序导航栏配置差异。

### 3. 分享

- 微信小程序：`onShareAppMessage`
- 支付宝小程序：属性名可能不同
- H5：Web Share API 或自定义逻辑

### 4. 键盘处理

```tsx
import { View, Input } from '@tarojs/components';
import { useState } from 'react';

const Comp = () => {
  const [pad, setPad] = useState(0);
  return (
    <View style={{ paddingBottom: pad + 'px' }}>
      <Input
        onFocus={(e) => setPad(e.detail?.height || 0)}
        onBlur={() => setPad(0)}
        placeholder="请输入"
      />
    </View>
  );
};
```

注意：小程序端 `keyboardheightchange` 较完善；H5 需用 `visualViewport` API。

### 5. 相册/相机权限与选图

```tsx
import Taro from '@tarojs/taro';

const chooseImage = async () => {
  try {
    const res = await Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
    });
    const file = res.tempFilePaths[0];
    // 上传 file...
  } catch (err: any) {
    if (err.errMsg?.includes('auth deny')) {
      Taro.showModal({
        title: '需要权限',
        content: '请在设置中开启相册权限',
        success: (m) => {
          if (m.confirm) Taro.openSetting();
        },
      });
    }
  }
};
```

注意：小程序临时文件有时效，尽快上传。

### 6. 地图展示与定位

```tsx
import Taro from '@tarojs/taro';
import { Map } from '@tarojs/components';

const MapScreen = () => {
  const [pos, setPos] = useState({ latitude: 0, longitude: 0 });

  useEffect(() => {
    Taro.getLocation({ type: 'gcj02' }).then(setPos);
  }, []);

  return (
    <Map
      style={{ width: '100%', height: 400 }}
      latitude={pos.latitude}
      longitude={pos.longitude}
      markers={[{ id: 1, ...pos, title: '位置' }]}
    />
  );
};
```

注意：Map 为原生组件层级最高，叠层必须用 CoverView；坐标系 gcj02。

### 7. 支付集成

```tsx
const pay = async () => {
  if (Taro.getEnv() === 'h5') {
    window.location.href = 'https://pay.example.com/order?id=xxx';
    return;
  }
  const params = await fetch('/api/payParams').then((r) => r.json());
  await Taro.requestPayment(params);
};
```

注意：签名必须服务端生成，前端禁止计算签名。

### 8. 扫码

```tsx
const scan = async () => {
  if (Taro.getEnv() === 'h5') {
    Taro.showModal({ title: '扫码', content: 'H5 不支持，请手动输入' });
    return;
  }
  const res = await Taro.scanCode({ onlyFromCamera: false });
  console.log('结果:', res.result);
};
```

### 9. 文件上传

```tsx
const upload = async () => {
  const { tempFiles } = await Taro.chooseMessageFile({ count: 1, type: 'file' });
  const task = Taro.uploadFile({
    url: 'https://api.example.com/upload',
    filePath: tempFiles[0].path,
    name: 'file',
  });
  task.progress((res) => console.log('进度:', res.progress));
  const res = await task;
};
```

注意：小程序文件限制 ~10MB；H5 进度可能不支持。

### 10. 推送/通知权限

```tsx
const notify = async () => {
  if (Taro.getEnv() === 'h5') {
    const p = await Notification.requestPermission();
    if (p === 'granted') new Notification('标题', { body: '内容' });
  } else {
    await Taro.requestSubscribeMessage({ tmplIds: ['xxx'] });
  }
};
```

注意：两套体系本质不同，交互层统一提示即可。

### 11. 蓝牙低功耗 BLE

```tsx
await Taro.openBluetoothAdapter();
await Taro.startBluetoothDevicesDiscovery({
  services: ['0000fff0-0000-1000-8000-00805f9b34fb'],
});
await Taro.createBLEConnection({ deviceId: 'xxx' });
const { services } = await Taro.getBLEDeviceServices({ deviceId: 'xxx' });
// 获取特征值, enable notify, read/write...
```

注意：Android 需位置权限；iOS UUID 可能变化；H5 仅 Chrome Web Bluetooth。

### 12. 陀螺仪/加速度计

```tsx
Taro.startGyroscope({ interval: 'game' });
Taro.onGyroscopeChange((res) => {
  console.log('x:', res.x, 'y:', res.y, 'z:', res.z);
});
```

注意：H5 用 DeviceOrientation API，坐标系可能不同。

---

## Coding Rules

- Keep platform divergence isolated in `src/platform/` or `src/utils/platform-*`.
- Avoid scattering `if (isAndroid)` or `if (isIOS)` across business pages.
- Use runtime capability detection before UA matching whenever possible.
- Normalize bridge response shape into one internal contract.
- Provide fallback for every native/hybrid call path.
- Keep timeout/retry policy consistent across platforms.
- Treat `references/rn-ui-hard-rules.md` as mandatory when writing RN-facing page code or styles.
- When auditing JSX/TSX, scan every `Text`: if it has no typography `className` / `style`, apply the decision tree in `references/rn-ui-hard-rules.md` §3 (Text typography audit) and add RN-safe text classes where required.
- For scroll list containers, if `padding` is applied, set `width: auto` to avoid cross-end width overflow or clipping.

---

## Recommended Structure

```
src/platform/
  runtime.{ts,js}       — runtime and capability detection
  bridge.{ts,js}        — unified JSBridge invocation
  storage.{ts,js}       — cookie/storage/session abstraction
  media.{ts,js}         — camera/file/upload/download abstraction
  compat-flags.{ts,js}  — switch table for temporary platform patches
```

---

## 构建配置

### Webpack 5 链式配置

```js
// config/index.js
module.exports = {
  mini: {
    webpackChain(chain) {
      chain.module
        .rule('custom')
        .test(/\.custom$/)
        .use('loader')
        .loader('custom-loader');
    },
  },
  h5: {
    webpackChain(chain) {
      /* H5 特殊处理 */
    },
  },
};
```

### 跨端插件

通过自定义 Taro 插件处理编译时/运行时跨端逻辑（polyfill 注入、API 统一等）。

---

## 架构建议

1. **分层分离** — 通用业务层 + 平台适配层。
2. **统一 API 封装** — 二次封装 Taro 未直接提供的 API。
3. **优先 Taro 生态** — Taro UI 等跨端组件库减少手动适配。
4. **充分测试** — 覆盖所有目标端常见用例。

---

## Read References

- Read `references/platform-compat-checklist.md` before implementing.
- Read `references/hybrid-bridge-patterns.md` when touching bridge, auth token sync, or native interaction.
- Read `references/rn-ui-hard-rules.md` when touching list, tab, view/text, or style declarations for RN compatibility.

---

## Delivery Checklist

- Confirm Android, iOS, and HarmonyOS each pass smoke tests.
- Confirm no uncaught Promise rejection in bridge calls.
- Confirm fallback path works when bridge is unavailable.
- Confirm UI key pages render without layout break.
- Confirm route transitions and back behavior are consistent.

---

## 参考资源

- [Taro 官方文档](https://docs.taro.zone/docs/components-desc)
- 本 skill `references/` 目录下的参考文件（通过 skill_view 加载）：
  - `rn-ui-hard-rules.md` — RN 端 UI 硬约束规则
  - `platform-compat-checklist.md` — 三端兼容性检查清单
  - `hybrid-bridge-patterns.md` — 统一 Bridge 调用模式
