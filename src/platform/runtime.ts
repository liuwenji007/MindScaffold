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
