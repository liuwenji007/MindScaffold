import Taro from '@tarojs/taro';

// 统一存储接口
const STORAGE_PREFIX = 'ms_';

export const Storage = {
  // 同步存储
  set(key: string, value: string): void {
    try {
      Taro.setStorageSync(STORAGE_PREFIX + key, value);
    } catch (e) {
      console.error('Storage set error:', e);
    }
  },

  // 同步读取
  get(key: string): string | null {
    try {
      return Taro.getStorageSync(STORAGE_PREFIX + key) || null;
    } catch (e) {
      console.error('Storage get error:', e);
      return null;
    }
  },

  // 删除
  remove(key: string): void {
    try {
      Taro.removeStorageSync(STORAGE_PREFIX + key);
    } catch (e) {
      console.error('Storage remove error:', e);
    }
  },

  // 清空
  clear(): void {
    try {
      Taro.clearStorageSync();
    } catch (e) {
      console.error('Storage clear error:', e);
    }
  },
};