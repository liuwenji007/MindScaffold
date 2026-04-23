import Taro from '@tarojs/taro';

/** 与 Taro `getEnv()` 对齐的运行时判断，集中多端分支 */

export function getRuntimeEnv(): string {
  try {
    return Taro.getEnv();
  } catch {
    return Taro.ENV_TYPE.WEB;
  }
}

export function isWeb(): boolean {
  return getRuntimeEnv() === Taro.ENV_TYPE.WEB;
}

export function isWeapp(): boolean {
  return getRuntimeEnv() === Taro.ENV_TYPE.WEAPP;
}

export function isRN(): boolean {
  return getRuntimeEnv() === Taro.ENV_TYPE.RN;
}

export function isAlipay(): boolean {
  return getRuntimeEnv() === Taro.ENV_TYPE.ALIPAY;
}

/** H5 或 RN（非小程序容器） */
export function isWebOrRN(): boolean {
  const e = getRuntimeEnv();
  return e === Taro.ENV_TYPE.WEB || e === Taro.ENV_TYPE.RN;
}

export interface RuntimeCapabilities {
  hasBridge: boolean;
  hasNativeStorageSync: boolean;
  hasNativeShare: boolean;
  hasNativeUpload: boolean;
}

type MaybeBridgeWindow = {
  ArkWeb?: unknown;
  harmony?: unknown;
  JSBridge?: unknown;
  HarmonyBridge?: unknown;
  webkit?: {
    messageHandlers?: unknown;
  };
};

function getWindowAny(): Record<string, unknown> | null {
  try {
    if (typeof window === 'undefined') return null;
    return window as unknown as Record<string, unknown>;
  } catch {
    return null;
  }
}

export function isHarmonyHybrid(): boolean {
  if (!isWeb()) return false;
  const win = getWindowAny() as MaybeBridgeWindow | null;
  if (!win) return false;
  return Boolean(win.ArkWeb || win.harmony || win.HarmonyBridge || win.webkit?.messageHandlers);
}

export function getRuntimeCapabilities(): RuntimeCapabilities {
  const win = getWindowAny() as MaybeBridgeWindow | null;
  const hasBridge = Boolean(win?.webkit?.messageHandlers || win?.JSBridge || win?.HarmonyBridge);
  return {
    hasBridge,
    hasNativeStorageSync: hasBridge || isWeapp() || isRN(),
    hasNativeShare: hasBridge || isWeapp() || isRN(),
    hasNativeUpload: hasBridge || isWeapp() || isRN()
  };
}
